import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../client";
import "/src/styles/PostDetails.css";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPostAndComments();
  }, [id]);

  const fetchPostAndComments = async () => {
    setLoading(true);

    const { data: postData, error: postError } = await supabase
      .from("post")
      .select(
        `
        post_id,
        post_content,
        post_attachment,
        username,
        profiles ( username, profile_pic )
      `
      )
      .eq("post_id", id)
      .single();

    if (postError) {
      console.error(postError);
    } else {
      setPost(postData);
    }

 const { data: commentData, error: commentError } = await supabase
  .from("comments")
  .select(`
    comment_id,
    post_content,
    created_at,
    profiles (
      username,
      profile_pic
    )
  `)
  .eq("post_id", id)
  .order("created_at", { ascending: true });

    if (commentError) {
      console.error(commentError);
    } else {
      setComments(commentData);
    }

    setLoading(false);
  };

const handleCommentSubmit = async () => {
  if (newComment.trim() === "") return;

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User must be logged in to comment.");
    return;
  }

  const { error } = await supabase.from("comments").insert([
    {
      post_id: id,
      post_content: newComment,
      user_id: user.id,
    },
  ]);

  if (error) {
    console.error("Error submitting comment:", error);
  } else {
    setNewComment("");
    fetchPostAndComments();
  }
};

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <div className="postdetails-container">
      <div className="postdetails-scrollbox">
        <button className="back-button" onClick={() => navigate("/home")}>
          ← Back to Home
        </button>

        <div className="postdetails-box">
          <div className="postdetails-user-info">
            {post.profiles?.profile_pic && (
              <img
                src={post.profiles.profile_pic}
                alt="Profile"
                className="postdetails-profile-pic"
              />
            )}
            <h2 className="postdetails-username">{post.username}</h2>
          </div>

          <p>{post.post_content}</p>

          {post.post_attachment && (
            <img
              src={post.post_attachment}
              alt="attachment"
              className="postdetails-image"
            />
          )}
        </div>

        {/* Comments Section */}
        <div className="comments-section">
          {/* New Comment Form – now above the comment list */}
          <div className="new-comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
            />
            <button onClick={handleCommentSubmit}>Post Comment</button>
          </div>
          {/* Comment List */}
          {comments.length > 0 ? (
  comments.map((comment) => (
    <div key={comment.comment_id} className="comment-box">
      <strong>{comment.profiles?.username || "Unknown"}</strong>:{" "}
      {comment.post_content}
    </div>
  ))
) : (
  <p>No comments yet.</p>
)}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
