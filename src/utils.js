/**
 * @param {number} min - min value of the random number 
 * @param {number} max - max value of the random number
 * @returns {number} - random number between min and max
 */
const getRandomIntInclusive = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

/**
 * @returns {string} - rgb color in CSS format
 */
const getRandomColor = () => {
    let r = getRandomIntInclusive(0, 255);
    let g = getRandomIntInclusive(0, 255);
    let b = getRandomIntInclusive(0, 255);
    return `rgb(${r}, ${g}, ${b})`;
}