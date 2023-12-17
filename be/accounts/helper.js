/*=================================================*/
/*                                                 */
/*              Written By TàoBa.                  */
/*                                                 */
/*=================================================*/

/**
 * Format ddyymm
 * @param {*} d 
 * @returns 
 */
const ddMMYY = (d, charSpace = '-') => d.getDate() + charSpace + (d.getMonth() + 1) + charSpace + d.getFullYear