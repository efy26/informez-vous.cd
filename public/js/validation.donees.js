/**
 * 
 * @param {string} username 
 * @returns {boolean}
 */
export const isUsernameValid = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
}

/**
 * 
 * @param {string} email 
 * @returns {boolean}
 */
export const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * @param {string} password 
 * @returns {boolean}
 */
export const isPasswordValid = (password) => {
    const passwordRegex = /^[A-Za-z0-9@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};   

/**
 * @param {string} first_name
 * @returns {boolean}
 */
export const isFirstNameValid = (first_name) => {
    const firstNameRegex = /^[a-zA-ZÀ-ÿ\s-]{2,30}$/;
    return firstNameRegex.test(first_name);
}

/**
 * @param {string} last_name
 * @returns {boolean}
 */
export const isLastNameValid = (last_name) => {
    const lastNameRegex = /^[a-zA-ZÀ-ÿ\s-]{2,30}$/;
    return lastNameRegex.test(last_name);
}

/**
 * @param {string} phone
 * @returns {boolean}
 */
export const isPhoneValid = (phone) => {
    const phoneRegex = /^[0-9+\s-]{6,20}$/;
    return phoneRegex.test(phone);
}

/**
 * @param {string} address_home
 * @returns {boolean}
 */
export const isAddressHomeValid = (address_home) => {
    const addressRegex = /^[a-zA-Z0-9À-ÿ\s,.'-]{5,100}$/;
    return addressRegex.test(address_home);
}

/**
 * @param {string} city
 * @returns {boolean}
 */
export const isCityValid = (city) => {
    const cityRegex = /^[a-zA-ZÀ-ÿ\s-]{2,50}$/;
    return cityRegex.test(city);
}

/**
 * @param {string} postal_code
 * @returns {boolean}
 */
export const isPostalCodeValid = (postal_code) => {
    const postalCodeRegex = /^[a-zA-Z0-9\s-]{1,20}$/;
    return postalCodeRegex.test(postal_code);
}
