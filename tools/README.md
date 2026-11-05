# tools/contours.py
Builds `assets/terrain.js` (20 m contours + route + stations + elevation profile).
Inputs it expects under `<work>/dl/`: `route.json` (parsed GPX points + cumulative distance), `stations.json` (name, route index, km, ele, segkm, up, down), `profile.json` (elevation every 250 m).
Usage: `python tools/contours.py <work> assets/terrain.js` (needs numpy, pillow, scikit-image).
Bounding box (LON0/LON1/LAT0/LAT1) and the km scale factor (99.2 official distance) are hard-coded for the UTCT route; change them for another race.
Elevation source: AWS Terrain Tiles (terrarium, z13).
