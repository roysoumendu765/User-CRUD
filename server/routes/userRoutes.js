const express = require("express");
const router = express.Router();
const {createUser, updateUser, deleteUser, getUser, getAllUsers} = require('../controllers/userControllers');

router.get('/getUser/:userId', getUser);
router.get('/getAllUsers', getAllUsers);
router.post('/create', createUser);
router.put('/update', updateUser);
router.delete('/delete', deleteUser);

module.exports = router;