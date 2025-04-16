import Navbar from "../components/nav-bar";
import PostSignupPopup from "../components/postSignupPopup.jsx";
import "/src/styles/home-page.css";
import { BsFillPostcardFill } from "react-icons/bs";
import { useContext, useState, useEffect, useRef } from "react";
import { supabase } from "../../client";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import useSound from "../hooks/useSound"; // Custom hook

const HomePage = () => {
  //////////////////////////////////////////////////////////////
  ///////////////To navigate pages//////////////////////////////
  const navigate = useNavigate();

  //////////////////////////////////////////////////////////////
  //////////////Toggle post container///////////////////////
  const [isPostContainerOpen, setIsPostContainerOpen] = useState(false); // manage post container visibility
  const togglePostContainer = () => {
    setIsPostContainerOpen((prevState) => !prevState); // Toggle the visibility
  };

  //////////////////////////////////////////////////////////////
  //////////////Sign out functionality///////////////////////
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    navigate("/login");
  };
  //////////////////////////////////////////////////////////////
  //////////////For linking different sounds to functions///////////////////////
    const mouseClickSound = useSound("/sounds/mouse-click.mp3");
    const gameStartSound = useSound("/sounds/game-start.mp3");
    const blipSound = useSound("/sounds/blip.mp3");

    //////////////////////////////////////////////////////////////
  //////////////Preview Profile Handler///////////////////////
  // const [selectedUser, setSelectedUser] = useState(null);
  // const [showUserPopup, setShowUserPopup] = useState(false);
  // const handleUsernameClick = (user) => {
  //   setSelectedUser(user);
  //   setShowUserPopup(true);
  //   mouseClickSound.volume = 0.1;
  //   mouseClickSound.play();
  // };

  //////////////////////////////////////////////////////////////
  //////////////Fetch data functionality///////////////////////
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Fetch posts from Supabase
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      let { data: posts, error } = await supabase
        .from("post")
        .select(`
          *,
          profiles (
            profile_pic
          )
        `)
        .order("created_at", { ascending: false }); // (newest first)
      if (error) {
        setError(error.message);
      } else {
        setData(posts);
      }
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  const scrollBoxRef = useRef(null);

  //////////////////////////////////////////////////////////////
  //////////////Refresh functionality///////////////////////
  const refreshPosts = async () => {
    fetchPosts(); // Refresh the list of posts
  };

  //////////////////////////////////////////////////////////////
  //////////////Post (send) functionality///////////////////////
  const [postContent, setPostContent] = useState("");
  const handleContentChange = (e) => {
    setPostContent(e.target.value);
  };

  // Post image state
  const [postImage, setPostImage] = useState(null);
  const handleImageChange = (e) => {
    setPostImage(e.target.files[0]);
  };

  // Function for image upload
  const uploadImage = async (image) => {
    try {
      // Generate file
      const fileExt = image.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `post-attachments/${fileName}`;
      // Upload image to db
      const { error: uploadError } = await supabase.storage
        .from("post-attachments")
        .upload(filePath, image);
      if (uploadError) {
        console.error("Image upload error:", uploadError.message);
        alert("Failed to upload image.");
        return null;
      }
      // Get URL of uploaded image
      const { data } = supabase.storage
        .from("post-attachments")
        .getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error("Unexpected upload error:", error);
      alert("Something went wrong while uploading the image.");
      return null;
    }
  };
  //////////////////////////////////////////////////////////////
  ////////////Function to handle post submission////////////////
  const handlePostClick = async () => {
    if (!postContent.trim() && !postImage) {
      alert("Please add some content or an image before posting.");
      return;
    }
    let imageUrl = null;
    // If there is an image, upload it first
    if (postImage) {
      imageUrl = await uploadImage(postImage);
      if (!imageUrl) return; // If upload fails, stop the post creation process
    }
    try {
      // Insert post data into table
      const { error: insertError } = await supabase.from("post").insert([
        {
          username: user.username, // Uses logged-in user
          post_content: postContent,
          post_attachment: imageUrl, // Can be null if no image
        },
      ]);
      if (insertError) {
        console.error("Post insert error:", insertError.message);
        alert("Failed to create post.");
        return;
      }
      // Success or error message
      gameStartSound.play(0.5);
      alert("Post created successfully!");
      setPostContent("");
      setPostImage(null);
      //fetchPosts(); // Refresh posts
    } catch (error) {
      console.error("Unexpected post error:", error);
      alert("Something went wrong while creating the post.");
    }
  };

  //////////////////////////////////////////////////////////////
  ///////////////////For user context///////////////////////////
  const { user } = useContext(UserContext);
  if (!user) {
    return <div>Loading...</div>;
  }

  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////

  

  return (
    <div>
      <PostSignupPopup />
      {/* Profile info section */}
      {/* Toggle Button */}
      <button onClick={togglePostContainer} className="toggle-post-button">
        <BsFillPostcardFill size={30} /> {/* Icon for the button */}
      </button>

      {/* Left side container for posting, conditional rendering */}
      {/* {isPostContainerOpen && (
        
      )} */}

      <div className="post-container">
        <div className="post-input-row">
          <textarea
            className="post-content"
            placeholder="Type your post here..."
            value={postContent}
            onChange={handleContentChange}
          />
          <div className="post-controls">
            <label htmlFor="file-input" className="custom-file-button">
              Choose File
            </label>
            <input
              type="file"
              id="file-input"
              accept="image/*"
              onChange={handleImageChange}
              className="post-image-input"
            />
            <span className="post-image-info">
              {postImage ? postImage.name : " No file chosen"}
            </span>
            <button onClick={handlePostClick} className="post-button">
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Media container displaying posts */}
      <div className="media-container">
        <div ref={scrollBoxRef} className="mediascroll-box">
          {loading ? (
            <p>Loading data...</p>
          ) : data && data.length > 0 ? (
            data.map((item, index) => (
              <div key={index} className="media-box">
                <div className="media-left">
                  <div className="media-user-info">
                    {item.profiles?.profile_pic && (
                      <img
                        src={item.profiles.profile_pic}
                        alt="Profile"
                        className="profile-pic"
                      />
                    )}
                    <span className="username">{item.username}

                    </span>
                  </div>
                  <p className="mediapost-content">{item.post_content}</p>
                </div>
                {item.post_attachment && (
                  <img
                    src={item.post_attachment}
                    alt="Attachment"
                    className="media-image"
                  />
                )}
              </div>
            ))
          ) : (
            <p>{error || "No data fetched yet..."}</p>
          )}
        </div>

        {/* Refresh button */}
        <div className="pagination-buttons">
          <button
            onClick={() => {
              refreshPosts();
              blipSound.play(0.5);
            }}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
