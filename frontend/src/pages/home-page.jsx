import Navbar from "../components/nav-bar";
import PostSignupPopup from "../components/postSignupPopup.jsx";
import "/src/styles/home-page.css";
import { BsFillPostcardFill } from "react-icons/bs";
import { useContext, useState, useEffect, useRef } from "react";
import { supabase } from "../../client";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";
import useSound from "../hooks/useSound"; // Custom hook
import StartDmButton from "../components/startdms.jsx";
import { BsHandThumbsUp, BsHandThumbsUpFill } from "react-icons/bs";

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
  //////////////Profile Popup Handler///////////////////////
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [favoriteGames, setFavoriteGames] = useState([]);
  const [isBlueBackground, setIsBlueBackground] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());

  const handleUsernameClick = async (username) => {
    const userData = data.find((item) => item.username === username);
    if (userData) {
      setSelectedUser(userData);
      setShowUserPopup(true);
      mouseClickSound.volume = 0.1;
      mouseClickSound.play();

      // Fetch their favorite games
      const { data: favGames, error } = await supabase
        .from("favorite_games")
        .select(
          `
        rank,
        games ( title )
      `
        )
        .eq("profile_id", userData.profiles.id) // profiles.id is the primary key you want
        .order("rank", { ascending: true });

      if (error) {
        console.error("Error fetching favorite games:", error.message);
        setFavoriteGames([]);
      } else {
        setFavoriteGames(favGames || []);
      }
    }
  };

  const closeUserPopup = () => {
    setSelectedUser(null);
    setShowUserPopup(false);
  };

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
        .select(
          `
        *,
        profiles (
          id,
         user_id, 
          profile_pic,
          bio,
          steam_link,
          Epic_link,
          PSN_link,
          Xbox_link,
          Discord_link
        )
      `
        )
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setData(posts);
      }

      // Fetch user's liked posts
      if (user) {
        const { data: likesData, error: likesError } = await supabase
          .from("likes")
          .select("post_id")
          .eq("profile_id", user.id);

        if (!likesError) {
          const likedPostIds = new Set(likesData.map((like) => like.post_id));
          setLikedPosts(likedPostIds);
        }
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
  const { user } = useContext(UserContext);
  if (!user) {
    return <div>Loading...</div>;
  }

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
      fetchPosts(); // Refresh posts
    } catch (error) {
      console.error("Unexpected post error:", error);
      alert("Something went wrong while creating the post.");
    }
  };

  //////////////////////////////////////////////////////////////
  ///////////////////Function to Handle Likes///////////////////////////
  const handleLikePost = async (postId) => {
    if (!user) {
      alert("You must be logged in to like a post.");
      return;
    }

    try {
      const profileId = user.id;

      if (likedPosts.has(postId)) {
        // Unlike the post
        const { error: deleteError } = await supabase
          .from("likes")
          .delete()
          .eq("post_id", postId)
          .eq("profile_id", profileId);

        if (deleteError) {
          console.error("Error removing like:", deleteError.message);
          return;
        }

        setLikedPosts((prev) => {
          const updated = new Set(prev);
          updated.delete(postId);
          return updated;
        });
      } else {
        // Like the post
        const { error: insertError } = await supabase
          .from("likes")
          .insert([{ post_id: postId, profile_id: profileId }]);

        if (insertError) {
          console.error("Error inserting like:", insertError.message);
          return;
        }

        setLikedPosts((prev) => new Set(prev).add(postId));
      }

      // Recount total likes
      const { count, error: countError } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", postId);

      if (!countError) {
        await supabase
          .from("post")
          .update({ likes: count })
          .eq("post_id", postId);

        setData((prevData) =>
          prevData.map((post) =>
            post.post_id === postId ? { ...post, likes: count } : post
          )
        );
      }
    } catch (error) {
      console.error("Unexpected error during like:", error);
    }
  };

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
              <div
                key={index}
                className="media-box"
                onClick={() => navigate(`/post/${item.post_id}`)}
                style={{ position: "relative", cursor: "pointer" }} // <-- Added position: relative
              >
                {/* Timestamp placed here */}
                <p className="post-timestamp">
                  {new Date(item.created_at).toLocaleString([], {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </p>

                <div className="likes-section">
                  <button
                    className="like-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikePost(item.post_id);
                    }}
                  >
                    {likedPosts.has(item.post_id) ? (
                      <BsHandThumbsUpFill size={20} />
                    ) : (
                      <BsHandThumbsUp size={20} />
                    )}
                  </button>
                  <span className="like-count">{item.likes || 0} likes</span>
                </div>

                <div className="media-left">
                  <div className="media-user-info">
                    {item.profiles?.profile_pic && (
                      <img
                        src={item.profiles.profile_pic}
                        alt="Profile"
                        className="profile-pic"
                      />
                    )}
                    <span
                      className="username"
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ STOP the event from reaching the post box
                        handleUsernameClick(item.username);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {item.username}
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
      {showUserPopup && selectedUser && (
        <div className="popup-overlay" onClick={closeUserPopup}>
          <div
            className={`popup-content ${
              isBlueBackground ? "blue-background" : "white-background"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-button" onClick={closeUserPopup}>
              X
            </button>
            {/* <button
              className="background-toggle-button"
              onClick={() => setIsBlueBackground((prev) => !prev)}
            >
              {isBlueBackground
                ? "Switch to White Background"
                : "Switch to Blue Background"}
            </button> */}
            <div className="popup-profile-info">
              <div className="profile-header">
                {selectedUser.profiles?.profile_pic && (
                  <img
                    src={selectedUser.profiles.profile_pic}
                    alt="Profile"
                    className="popup-profile-pic"
                  />
                )}
                <h2 className="popup-username">{selectedUser.username}</h2>
              </div>

              <p className="user-bio">
                {selectedUser.profiles?.bio || "No bio available."}
              </p>
              {/* Favorite Games Section */}
              {favoriteGames.length > 0 && (
                <div className="favorite-games">
                  <h3>Favorite Games</h3>
                  <ol>
                    {favoriteGames.map((game, index) => (
                      <li key={index}>{game.games?.title || "Unknown Game"}</li>
                    ))}
                  </ol>
                </div>
              )}
              {/* Linked Services */}
              <div className="linked-services">
                <h3>Linked Services</h3>
                <ul>
                  {selectedUser.profiles?.steam_link && (
                    <li>
                      <strong>Steam:</strong>{" "}
                      <span>{selectedUser.profiles.steam_link}</span>
                    </li>
                  )}
                  {selectedUser.profiles?.Epic_link && (
                    <li>
                      <strong>Epic Games:</strong>{" "}
                      <span>{selectedUser.profiles.Epic_link}</span>
                    </li>
                  )}
                  {selectedUser.profiles?.PSN_link && (
                    <li>
                      <strong>PSN:</strong>{" "}
                      <span>{selectedUser.profiles.PSN_link}</span>
                    </li>
                  )}
                  {selectedUser.profiles?.Xbox_link && (
                    <li>
                      <strong>Xbox:</strong>{" "}
                      <span>{selectedUser.profiles.Xbox_link}</span>
                    </li>
                  )}
                  {selectedUser.profiles?.Discord_link && (
                    <li>
                      <strong>Discord:</strong>{" "}
                      <span>{selectedUser.profiles.Discord_link}</span>
                    </li>
                  )}
                </ul>
              </div>
              <StartDmButton
                currentUserId={user.user_id}
                participantId={selectedUser.profiles.user_id}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
