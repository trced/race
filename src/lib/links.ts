/** Les adresses du projet, en un seul endroit.
 *  Dans lib/ plutôt que dans site/ : l'application y renvoie aussi, et
 *  l'AGPL demande qu'elle offre son code source depuis son interface. */

export const REPO = 'https://github.com/trced/race'
export const CONTACT_EMAIL = 'contact@race.app'
export const CONTACT = `mailto:${CONTACT_EMAIL}`

/** Le fichier livré avec le programme, pas le texte canonique de la FSF.
 *
 *  C'est celui-là qui fait foi : l'AGPL demande qu'une copie de la licence
 *  accompagne le logiciel, et « or later » veut dire que le fichier du dépôt
 *  peut dire une chose que la page d'une version précise ne dit pas. Le lien
 *  atterrit dans le même dépôt que « code source » — l'utilisateur qui veut
 *  vérifier ses droits trouve le texte et le code au même endroit. */
export const LICENCE_URL = `${REPO}/blob/main/LICENSE`
