require('dotenv').config({ path: '.env' })

module.exports = {
  contentRepFolders: process.env.CONTENT_REP_FOLDERS.split(', '),
  defaultPathToContent: process.env.PATH_TO_CONTENT,
}
