import crypto from "crypto"


let a = crypto.randomBytes(3)

let b = crypto.randomBytes(3).toString('hex')


console.log(a)
console.log(b)


