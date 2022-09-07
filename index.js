const express = require("express")
const con = require('./config')
const cors = require("cors");
const Jwt = require('jsonwebtoken');
const jwtKey = 'e-com';
const app = express()
app.use(cors());
app.use(express.json())
app.get("/users", (req, resp) => {
    con.query("select * from users", (err, result) => {
        if (err) {
            resp.send("err")
        } else (
            resp.send(result)
        )
    })
})

app.post("/register", (req, resp) => {
    if (req.body.name && req.body.email && req.body.password) {

        const ran = req.body
        con.query(
            `SELECT * FROM users WHERE email = ${con.escape(req.body.email)};`,
            (err, result) => {
                // user does not exists
                if (err) {
                    throw err;
                    return res.status(400).send({
                        msg: err
                    });
                }


            }
        );






        const data = req.body
        con.query("INsert INTO users SET ?", data, (error, result) => {
            if (error) throw error;

            Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                if (err) {
                    resp.send("Something went wrong")
                }
                resp.send({ data, auth: token })
            })
        })
    }
    else {
        resp.send("please provide correct input")
    }

})








const { check } = require('express-validator');

exports.loginValidation = [
    check('email', 'Please include a valid email').isEmail().normalizeEmail({ gmail_remove_dots: true }),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })

]














app.post('/login', (req, res, next) => {
    if (req.body.email && req.body.password) {
        const data = req.body
        con.query(
            `SELECT * FROM users WHERE email = ${con.escape(req.body.email)};`,
            (err, result) => {
                // user does not exists
                if (err) {
                    throw err;
                    return res.status(400).send({
                        msg: err
                    });
                }
                if (!result.length) {
                    return res.status(401).send({
                        msg: 'Email or password is incorrect!'
                    });
                } else {
                    Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
                        if (err) {
                            res.send("Something went wrong")
                        }
                        res.send({ data, auth: token })
                    })
                }
            }
        );
    }
    else {
        return res.status(401).send({
            msg: 'Email or password is incorrect!'
        });
    }
});



// app.put("/:id", (req, resp) => {
//     const data = [req.body.name, req.body.password, req.body.user_type, req.params.id];
//     con.query("UPDATE users SET name =?,password=?, user_type=? where id =?", data, (error, result, fields) => {
//         if (error) throw error;
//         resp.send(result)
//     })
//     resp.send("update api working")
// })


// app.delete("/:id", (req, resp) => {
//     con.query("DELETE FROM users WHERE id =" + req.params.id, (error, result, fields) => {
//         if (error) throw error;
//         resp.send(result)
//     })
// })

app.listen(5000)