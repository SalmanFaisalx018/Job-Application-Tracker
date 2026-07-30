const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const filePath = path.join(__dirname, "../data/users.json");

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required."
            });
        }
       const users = JSON.parse(
    fs.readFileSync(filePath, "utf8")
);

      
        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: Date.now(),
            name,
            email,
            password: hashedPassword
        };

        users.push(newUser);

        fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

        res.status(201).json({
            message: "User registered successfully."
        });

    } catch(error){

    console.log(error);

    res.status(500).json({
        message:error.message
    });

}
};


const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required."
            });
        }

        const users = JSON.parse(
            fs.readFileSync(filePath, "utf8")
        );

        const user = users.find(user => user.email === email);

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch(error){

    console.log(error);

    res.status(500).json({
        message:error.message
    });

}
};
module.exports = {
    signup,
    login
};