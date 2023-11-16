import PostModel from '../models/PostModel.js'


export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate({ path: "user", select: ["fullName", "avatarUrl"] }).exec();

        res.json(posts);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Couldnt get posts'
        })
    }
};

export const getOne = async (req, res) => {
    try {
      const postId = req.params.id;

  
    PostModel.findOneAndUpdate(
    {
      _id: postId,
    },
    {
      $inc: { viewsCount: 1 },
    },
    {
      returnDocument: "after",
    }
  ).populate([{ 
    path: "comments", populate: { path: "postedBy", select: ["fullName", "avatarUrl"] }
  }, { 
    path: "user", select: ["fullName", "avatarUrl"] }]).then((doc, err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        message: "Failed to return the post",
      });
    }
    if (!doc) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    res.json(doc);
  });
  } catch (err) {
  console.log(err);
  res.status(500).json({
    message: "Error",
    });
   }
};

export const getLastTags = async (req, res) => {
  try {
    const posts = await PostModel.find().exec();

    const tags = posts.map(obj => obj.tags).flat().slice(0, 10);

    res.json(tags);
} catch (err) {
    console.log(err);
    res.status(500).json({
        message: 'Couldnt get tags'
    });
}
};

export const getTag = async (req, res) => {
  try{
  const tag = req.params.tag;

  const posts = await PostModel.find({
    tags: tag
  }).populate({ path: "user", select: ["fullName", "avatarUrl"] }).exec();

  res.json(posts);
} catch (err) {
  console.log(err);
  res.status(500).json({
    message: 'Coudnt get tag'
  });
}};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    }catch (err) {{
        console.log(err);
        res.status(500).json({
            message: 'Couldnt create post'
        })
    }}
};

export const comment = async (req, res) => {
  try {
    const postId = req.params.id
    await PostModel.findByIdAndUpdate(postId, { $push:
      {
        comments: {
          text: req.body.text,
          postedBy: req.userId
        }},
    }, { new: true },
).then((doc, err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Failed to comment the post",
        });
      }
      if (!doc) {
        return res.status(404).json({
          message: "Post not found",
        });
      }

  res.json(doc);
    });

    await PostModel.findOneAndUpdate(
      {
        _id: postId
      },
      {
        $inc: { commentsCount: 1 },
      },
      {
        returnDocument: "after",
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error",
      });
}
};

export const getComments = async (req, res) => {
  try{
    const post = await PostModel.findById(req.params.id).populate({ 
      path: "comments", populate: { path: "postedBy", select: ["fullName", "avatarUrl"] }
    });
    const data = post.comments;
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({
        message: 'Couldnt get comms'
    })
}
};

export const removeComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commId = req.params.commId;
   
    await PostModel.findOneAndUpdate({
      _id: postId
    }, {$pull: {comments: {_id: commId}}}).then(
      (doc, err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          message: "Failed to return the post",
        });
      }
      if (!doc) {
        return res.status(404).json({
          message: "Post not found",
        });
      }});
    res.json({
      message: "Comment Deleted!"
    });
    await PostModel.findOneAndUpdate(
      {
        _id: postId
      },
      {
        $inc: { commentsCount: -1 },
      }
    );
  } catch (err) {
    console.log(err);
res.status(500).json({
  message: "Error",
  });
}
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.findOneAndUpdate({
            _id: postId
        }, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            user: req.body.userId,
            tags: req.body.tags.split(','),
        },
        {
            returnDocument: "after",
        }).then((doc, err) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                message: "Failed to return the post",
              });
            }
            if (!doc) {
              return res.status(404).json({
                message: "Post not found",
              });
            }

        res.json(doc);
    });
    } catch (err) {
        console.log(err);
        res.status(500).json({
          message: "Error",
          });
    }
};

export const removePost = async (req, res) => {
  try {
      const postId = req.params.id;
      
      await PostModel.findOneAndDelete({
      _id: postId,
      }).then((doc, err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              message: "Failed to return the post",
            });
          }
          if (!doc) {
            return res.status(404).json({
              message: "Post not found",
            });
          }
          res.json({
              message: 'Successfully Deleted!'
          });
        });
} catch (err) {
console.log(err);
res.status(500).json({
  message: "Error",
  });
 }
};