const AdminAuth = (req, res, next) => {
    console.log(
        'validating request'
    )
    const token = 'fdsxyz';

    if (token !== 'xyz') {
        res.status(401).send('unAuth')
    } else {
        next();
    }

}

module.exports = {
    AdminAuth
}