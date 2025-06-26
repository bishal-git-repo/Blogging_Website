const express = require('express');
const { addBlogHandler, getBlogsHandler, blogDetail, editBlogHandler, deleteBlogHandler } = require('../controllers/blogController');
const router = express.Router();

//blog add route
router.post('/', addBlogHandler)

//get blog list
router.get('/blog-list', getBlogsHandler)

//get particular blog
router.get('/blogList/:id', blogDetail)

//edit blog
router.put('/editBlog/:id', editBlogHandler)

//delete blog
router.delete('/deleteBlog/:id', deleteBlogHandler)


module.exports = router;