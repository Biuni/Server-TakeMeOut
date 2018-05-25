const crypto = require('crypto')
const promisify = require('../../utils/promisify')

const changePwd = (oldPwd, newPwd) => {
  const oldPwdHash = crypto.createHash('sha256').update(oldPwd).digest('hex')
  const updatedPwd = crypto.createHash('sha256').update(newPwd).digest('hex')

  return promisify.query('SELECT `password` FROM `user` WHERE `id` = 1')
    .then(res => {
      if (res[0].password === oldPwdHash) {
        promisify.query('UPDATE `user` SET `password` = ? WHERE `id` = 1', [updatedPwd])
        return true
      } else {
        return false
      }
    })
}

const getUsers = () => promisify.query('SELECT `id`, `uuid`, `mail`, `name`, `date` FROM `user` WHERE `id` <> 1')

const deleteUser = (id) => {
  if (id !== 1) {
    return promisify.query('DELETE FROM `user` WHERE `id` = ?', [id])
  }
}

module.exports = {
  getUsers,
  deleteUser,
  changePwd
}
