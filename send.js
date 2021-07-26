require('dotenv').config()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const FROM_PHONE_NUMBER ="+15616933716"
const client = require('twilio')(accountSid, authToken);
const COUNTRY_CODE = {
    'singapore': '65',
    'australia': '61',
    'vietnam': '84',
}

const sendSMS = async (message, rawPhone, country, _event = '') => {
    const phone = formatPhoneWithCountryCode(rawPhone, country)
    // return { rs: message, phone }
    return client.messages
        .create({
            body: `${message}`,
            from: FROM_PHONE_NUMBER,
            to: `${phone}`,
        })
        .then(message => { return { rs: message, phone } })
}


const getCountryCode = (country) => {
    return COUNTRY_CODE[country]
}

const checkIsHasCountryCode = (phone) => {
    const countryCodeInPhone = phone.substr(0, 2);
    const rs = Object.keys(COUNTRY_CODE).find(item => COUNTRY_CODE[item] === countryCodeInPhone)
    return !!rs
}

const formatPhoneWithCountryCode = (rawPhone, country) => {
    const countryCode = getCountryCode(country.toLowerCase())
    if (!countryCode || !rawPhone) {
        return null
    }

    let phone = rawPhone.replace(/(\.)*(\-)*(\s)*(\()*(\))*/g, '')
    console.log("new phone 1: ", phone)
    phone = phone.replace(/^\+/, '')
    console.log("new phone: ", phone)

    if (checkIsHasCountryCode(phone)) {
        console.log("Phone has country code! ", phone)
        return `+${phone}`
    } else {
        const tempPhone = phone.replace(/^0/g, '')
        return `+${countryCode}${tempPhone}`
    }
}

sendSMS("test","0776715590",'vietnam')