import PostModel from '../models/PostModel.js'

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate({ path: "user", select: ["name", "avatar"] }).exec();

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
  ).populate({ path: "user", select: ["name", "avatar"] }).then((doc, err) => {
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
    const posts = await PostModel.find().limit(5).exec();

    const tags = posts.map(obj => obj.tags).flat().slice(0, 4);

    res.json(tags);
} catch (err) {
    console.log(err);
    res.status(500).json({
        message: 'Couldnt get tags'
    })
}
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
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
    const postId = req.params.id;
    
    await PostModel.findOneAndUpdate({
      _id: postId
    }, { $push: 
      {
        comments: {
          text: req.body.text,
          postedBy: req.userId
        }},
    }, { new: true }, 
    { returnDocument: "after",}
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
    })
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error",
      });
}
}

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