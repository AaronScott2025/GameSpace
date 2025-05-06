import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../client";
import "/src/styles/PostDetails.css";

const PostDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      setLoading(true);

      const { data: postData, error: postError } = await supabase
        .from('post')
        .select(`
          post_id,
          post_content,
          post_attachment,
          username,
          profiles ( username, profile_pic )
        `)
        .eq('post_id', id)
        .single();

      if (postError) {
        console.error(postError);
      } else {
        setPost(postData);
      }

      const { data: commentData, error: commentError } = await supabase
        .from('comments')
        .select(`
          id,
          comment_content,
          profiles ( username, profile_pic )
        `)
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      if (commentError) {
        console.error(commentError);
      } else {
        setComments(commentData);
      }

      setLoading(false);
    };

    fetchPostAndComments();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found.</div>;

  return (
    <div className="postdetails-container">
  <div className="postdetails-scrollbox">

    {/* Back Button */}
    <button className="back-button" onClick={() => navigate("/home")}>
      ← Back to Home
    </button>

    {/* Main post box */}
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
    <img src={post.post_attachment} alt="attachment" className="postdetails-image" />
  )}
</div>

    {/* Comments Section */}
    <div className="comments-section">
      <h3>Comments:</h3>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="comment-box">
            <strong>{comment.profiles?.username || "Unknown"}</strong>: {comment.comment_content}
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
