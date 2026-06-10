import Staff from "../models/Staff.js";

const generateUsername = async (fullName) => {
    let username = fullName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ".");

    let finalUsername = username;
    let counter = 1;

    while (
        await Staff.findOne({
            "accountInfo.username": finalUsername,
        })
    ) {
        finalUsername = `${username}${counter}`;
        counter++;
    }

    return finalUsername;
};

export default generateUsername;