# Project Standards
- We use React-Three-Fiber for all 3D elements.
- Always use `InstancedMesh` for repeated geometries (like the hex grid) to save performance.
- Animation transitions between 'Grid View' and 'Page View' must use GSAP for camera movement.
- State management must be handled in Zustand.