const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailers/comments_mailer');
const queue= require('../config/kue');
const commentEmailWorker= require('../workers/comment_email_worker');
const Like = require('../models/like');


module.exports.create = async function(req, res){

    try{
        let post = await Post.findById(req.body.post);


        if (post){
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });

            post.comments.push(comment);
            post.save();

            comment = await comment.populate('user', 'name email');
            //commentsMailer.newComment(comment);
            let job = queue.create('emails', comment).save(function(err){
                if(err){
                    console.log('error in creating a queue', err);
                    return;
                }
                console.log('job enqueued', job.id);
            })
            
            res.redirect('/');

        }

    }catch(err){
        console.log('Error', err);
        return;
    }
    
}


module.exports.destroy = async function(req, res){

    try{
        let comment = await Comment.findById(req.params.id);

        if (comment.user == req.user.id){

            let postId = comment.post;

            comment.remove();

            let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

            // Change:: destroy the associated likes for this comments
            await Like.deleteMany({likeable: comment._id, onModel:'Comment'});

            return res.redirect('back');
        }else{
            return res.redirect('back');
        }
    }catch(err){
        console.log('Error', err);
        return;
    }
    
}