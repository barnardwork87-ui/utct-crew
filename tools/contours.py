import math, json, os, sys, urllib.request, io
import numpy as np
from PIL import Image
from skimage import measure, filters
S=sys.argv[1]; Z=13
LON0,LON1,LAT0,LAT1=18.27,18.51,-33.885,-34.085   # west,east,north,south
def tile(lon,lat,z):
  n=2**z; x=(lon+180)/360*n; y=(1-math.asinh(math.tan(math.radians(lat)))/math.pi)/2*n; return x,y
x0,y0=tile(LON0,LAT0,Z); x1,y1=tile(LON1,LAT1,Z)
tx=range(int(x0),int(x1)+1); ty=range(int(y0),int(y1)+1)
rows=[]
for y in ty:
  row=[]
  for x in tx:
    p=f"{S}/tiles/{Z}_{x}_{y}.png"
    if not os.path.exists(p):
      urllib.request.urlretrieve(f"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{Z}/{x}/{y}.png",p)
    a=np.asarray(Image.open(p).convert('RGB')).astype(float)
    row.append(a[...,0]*256+a[...,1]+a[...,2]/256-32768)
  rows.append(np.hstack(row))
H=np.vstack(rows)
# crop to bbox in pixel space
px0=(x0-tx[0])*256; px1=(x1-tx[0])*256; py0=(y0-ty[0])*256; py1=(y1-ty[0])*256
H=H[int(py0):int(py1),int(px0):int(px1)]
H=filters.gaussian(H,sigma=1.2,preserve_range=True)
h,w=H.shape; print('grid',w,h,'max',H.max())
# output units: SVG width 1000
W=1000; sc=W/w; VH=round(h*sc)
def lonlat_to_xy(lon,lat):
  x,y=tile(lon,lat,Z); return ((x-tx[0])*256-px0)*sc, ((y-ty[0])*256-py0)*sc
out={'w':W,'h':VH,'levels':[]}
for lev in list(range(20,1100,20)):
  paths=[]
  for c in measure.find_contours(H,lev):
    if len(c)<12: continue
    c=measure.approximate_polygon(c,tolerance=0.7)
    d='M'+'L'.join(f"{p[1]*sc:.1f},{p[0]*sc:.1f}" for p in c)
    paths.append(d)
  out['levels'].append({'e':lev,'d':' '.join(paths)})
# coastline
coast=[]
for c in measure.find_contours(H,1.5):
  if len(c)<20: continue
  c=measure.approximate_polygon(c,tolerance=0.7)
  coast.append('M'+'L'.join(f"{p[1]*sc:.1f},{p[0]*sc:.1f}" for p in c))
out['coast']=' '.join(coast)
r=json.load(open(f"{S}/dl/route.json")); st=json.load(open(f"{S}/dl/stations.json"))
pts=r['pts']; step=2
xy=[lonlat_to_xy(p[1],p[0]) for p in pts]
out['route']='M'+'L'.join(f"{x:.1f},{y:.1f}" for x,y in xy[::step]+[xy[-1]])
k=99.2/(r['cum'][-1]/1000)
out['routeKm']=[round(c/1000*k,2) for c in r['cum'][::step]+[r['cum'][-1]]]
out['routeXY']=[[round(x,1),round(y,1)] for x,y in xy[::step]+[xy[-1]]]
for s in st:
  x,y=xy[s['i']]; s['x']=round(x,1); s['y']=round(y,1)
out['stations']=st
out['profile']=json.load(open(f"{S}/dl/profile.json"))
js='window.TERRAIN='+json.dumps(out,separators=(',',':'))+';'
open(sys.argv[2],'w').write(js); print('bytes',len(js),'viewbox',W,VH)
