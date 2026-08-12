/** Version unique du projet, injectée depuis package.json à la compilation.
 *  Un seul endroit à bumper — voir le skill /release. */

declare const __APP_VERSION__: string

export const APP_VERSION: string =
  typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : '0.0.0'
