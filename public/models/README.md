# Models

Every `.glb` here is meshopt-compressed. `car-3d.tsx` sets `MeshoptDecoder` on
the loader, so an uncompressed drop-in will load blank. To add one:

```
npx gltfpack -i source.glb -o public/models/<name>.glb -cc -vp 16 -vtf
```

`-cc` is the compression, `-vp 16` keeps positions precise enough that panel
gaps do not shimmer, and `-vtf` keeps texture coordinates as floats. Watch the
warnings: at the defaults one car came out with 400% texture-coordinate error
(visibly scrambled paint) and another with a negative bounding box.

Texture compression (`-tc` for KTX2, `-tw` for WebP) is **not** available from
the npm build of gltfpack — it needs a native binary from the meshoptimizer
releases. That is why the larger cars are still several megabytes: the geometry
is compressed, the textures are not. Each model is fetched only when someone
looks that car up, so no visitor pays for more than one.

`toy-car.glb` — "Toy Car" by Guido Odendahl, materials by Eric Chadwick.
Public domain (CC0). From the Khronos glTF-Sample-Models repository:
https://github.com/KhronosGroup/glTF-Sample-Models/tree/main/2.0/ToyCar

Held here rather than hotlinked so the demo does not depend on GitHub being up,
and so nothing about this screen needs a third-party request at runtime. It is
also the fallback body's origin story: a generic toy car, because real car
bodies are trademarked designs and the free models of them carry unclear
licences. The UI says "illustration only" for the same reason.

## What each file is

| File | Depicts | Named in the fleet as |
|---|---|---|
| `accord.glb` | 2021 Honda Accord | Honda Accord Hybrid |
| `city.glb` | 2017 Honda City | Honda City ZX |
| `civic.glb` | Honda Civic | Honda Civic VX |
| `ertiga.glb` | 2022 Suzuki Ertiga | Maruti Suzuki Ertiga ZXI |
| `i20.glb` | 2022 Hyundai i20 N Line | Hyundai i20 N Line |
| `jazz.glb` | Honda Jazz | Honda Jazz V |
| `safari.glb` | 2021 Tata Safari | Tata Safari XZ+, Tata Safari DICOR |
| `santro.glb` | Hyundai Santro | Hyundai Santro Xing |
| `sonet.glb` | Kia Sonet | Kia Sonet HTK+ |
| `swift.glb` | 2022 Suzuki Swift | Maruti Suzuki Swift VXI |
| `wagonr.glb` | 2013 Suzuki WagonR | Maruti Suzuki WagonR LXI |

There is no Bolero model here. We held one — an SUV — but the only Bolero in the
fleet is a **Pik-Up**: a goods carrier with an open cargo bed, owned by a
transport company, with a fitness certificate and an overloading challan. Those
are different vehicles to anyone who looks, so that record takes the generic
body rather than a car it is not, and a 5.7MB file nothing loads was weight for
no one. Add it back if a Bolero SUV ever joins the fleet.

Two gaps that are smaller but still real: `city.glb` is the previous-generation
City standing in for a 2021 car, and `safari.glb` is the 2021 Safari standing in
for a 2011 Safari DICOR. Same nameplate, different generation.
