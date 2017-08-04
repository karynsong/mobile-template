export const reverseStringByFour = (str) => {
    return str.split('').reverse().join('').replace(/(\w{4})(?=\w)/g, "$1 ").split('').reverse().join('')
}