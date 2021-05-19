
/** Astro packages some global constants that link our game world and real-world physical numbers. */
export const Astro = {

    /** How many game space units correspond to one kilometer in real space */
    PixelPerKm: 1.0 / 15.0,

    /** How many milliseconds of game represent one real second (which becomes one update cycle in the code) */
    GameMsPerRealSec: 10.0,

    /** Gravitational constant from physics school books */
    G: 6.674e-11, // km³ / Mt / s²
    // 1 Mt = 10^9 kg
    // 1 km³ = 10^9 m³

};