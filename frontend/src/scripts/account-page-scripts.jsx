import { createClient } from "@supabase/supabase-js";
import axios from "axios";
const supabaseUrl = import.meta.env.VITE_SUPABASE_REACT_APP_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_REACT_APP_API_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const updateUserPassword = async (newPassword) => {
  if (!newPassword || typeof newPassword !== 'string' || newPassword.trim() === '') {
    console.error("Invalid password provided");
    return false;
  }
  
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      console.error("Error updating password:", error.message);
      return false;
    }
    console.log("Password updated successfully");
    return true;
  } catch (err) {
    console.error("Unexpected error updating password:", err);
    return false;
  }
};

export const handleGameSelection = async (userId, username, gameId, rank) => {
  if (!userId || !username || !gameId || !rank) {
    console.error("Missing required parameters for handleGameSelection");
    return { success: false, error: "Missing required parameters" };
  }
  
  try {
    const { data: existingEntry, error: fetchError } = await supabase
      .from("favorite_games")
      .select("*")
      .eq("profile_id", userId)
      .eq("profile_username", username)
      .eq("rank", rank)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Error checking for existing favorite game:", fetchError);
      return { success: false, error: fetchError };
    }

    if (existingEntry) {
      const { error: updateError } = await supabase
        .from("favorite_games")
        .update({ game_id: gameId })
        .eq("profile_id", userId)
        .eq("profile_username", username)
        .eq("rank", rank);

      if (updateError) {
        console.error("Error updating favorite game:", updateError);
        return { success: false, error: updateError };
      }
    } else {
      const { error: insertError } = await supabase
        .from("favorite_games")
        .insert([
          {
            profile_id: userId,
            profile_username: username,
            game_id: gameId,
            rank: rank
          }
        ]);

      if (insertError) {
        console.error("Error adding favorite game:", insertError);
        return { success: false, error: insertError };
      }
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error in handleGameSelection:", err);
    return { success: false, error: err };
  }
};

export const uploadProfilePic = async (userId, file) => {
  if (!userId) {
    console.error("User ID is required");
    return null;
  }
  
  if (!file) {
    console.error("No file provided");
    return null;
  }
  
  try {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      console.error("Invalid file type. Only JPEG, PNG, GIF, and WebP are supported.");
      return null;
    }
    
    const { error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();
      
    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return null;
    }
    
    const fileExt = file.name.split(".").pop().toLowerCase();
    const fileName = `profile_${userId}_${Date.now()}.${fileExt}`;
    const filePath = fileName;
    
    const { error: uploadError } = await supabase.storage
      .from("profile_pics")
      .upload(filePath, file, { upsert: true });
      
    if (uploadError) {
      console.error("Error uploading file:", uploadError.message);
      return null;
    }
    
    const { data: publicUrlData } = supabase.storage
      .from("profile_pics")
      .getPublicUrl(filePath);
      
    const publicUrl = publicUrlData.publicUrl;
    
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ profile_pic: publicUrl })
      .eq("id", userId);
      
    if (updateError) {
      console.error("Error updating profile with new profile_pic:", updateError.message);
      return null;
    }
    
    return publicUrl;
  } catch (err) {
    console.error("Unexpected error in uploadProfilePic:", err);
    return null;
  }
};

export const updateLinkedServices = async (userId, linkedServices) => {
  if (!userId) {
    console.error("User ID is required");
    return false;
  }
  
  try {
    const { error } = await supabase
      .from("profiles")
      .update(linkedServices)
      .eq("id", userId);
      
    if (error) {
      console.error("Error updating linked services:", error.message);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Unexpected error updating linked services:", err);
    return false;
  }
};

export const getUserInfo = async (userId) => {
  if (!userId) {
    console.error("User ID is required");
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select(
        "username, email, profile_pic, bio, steam_link, Epic_link, PSN_link, Xbox_link, Discord_link"
      )
      .eq("id", userId)
      .single();
      
    if (error) {
      console.error("Error fetching user info:", error.message);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error("Unexpected error fetching user info:", err);
    return null;
  }
};

export const updateUserBio = async (userId, bio) => {
  if (!userId) {
    console.error("User ID is required");
    return false;
  }
  
  try {
    const { error } = await supabase
      .from("profiles")
      .update({ bio })
      .eq("id", userId);
      
    if (error) {
      console.error("Error updating bio:", error.message);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Unexpected error updating bio:", err);
    return false;
  }
};

export const generateProfilePic = async (userId, prompt) => {
  if (!userId) {
    console.error("User ID is required");
    return null;
  }
  
  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    console.error("Valid prompt is required");
    return null;
  }

  try {
    console.log("Generating profile picture with prompt:", prompt);
    
    const response = await axios.post("/api/logogen/", {
      prompt: prompt.trim(),
    });

    if (!response || !response.data) {
      console.error("Invalid or empty response from API");
      return null;
    }

    if (response.data.error) {
      console.error("API returned an error:", response.data.error);
      return null;
    }

    if (!response.data.generated ||
        !Array.isArray(response.data.generated) || 
        response.data.generated.length === 0) {
      console.error("No generated images in response:", response.data);
      return null;
    }

    const imageUrl = response.data.generated[0]?.url;
    if (!imageUrl) {
      console.error("No image URL in first generated item:", response.data.generated[0]);
      return null;
    }

    try {
      new URL(imageUrl);
    } catch (e) {
      console.error("Invalid URL format:", imageUrl);
      return null;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ profile_pic: imageUrl })
      .eq("id", userId);

    if (error) {
      console.error("Error updating profile with generated image:", error.message);
      return null;
    }

    return imageUrl;
  } catch (err) {
    console.error("Unexpected error in generateProfilePic:", err);
    
    if (err.response) {
      console.error("Response data:", err.response.data);
      console.error("Response status:", err.response.status);
    }
    
    return null;
  }
};

export const generateUsername = async (userId, message) => {
  if (!userId) {
    console.error("User ID is required");
    return null;
  }
  
  if (!message || typeof message !== "string" || message.trim() === '') {
    console.error("Valid message is required for username generation");
    return null;
  }

  try {
    const response = await axios.post("/api/namegen/", { 
      message: message.trim() 
    });

    if (!response || !response.data) {
      console.error("Invalid or empty response from API");
      return null;
    }

    const newUsername = response.data.response?.trim();
    if (!newUsername) {
      console.error("No username returned from API");
      return null;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ username: newUsername })
      .eq("id", userId);

    if (error) {
      console.error("Error updating username:", error.message);
      return null;
    }

    return newUsername;
  } catch (err) {
    console.error("Unexpected error in generateUsername:", err);
    if (err.response) {
      console.error("Response data:", err.response?.data);
      console.error("Response status:", err.response?.status);
    }
    return null;
  }
};

export const getFavoriteGames = async (userId, username) => {
  if (!userId || !username) {
    console.error("User ID and username are required");
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from("favorite_games")
      .select(`
        rank,
        games:game_id (
          id,
          title,
          cover_art_url
        )
      `)
      .eq("profile_id", userId)
      .eq("profile_username", username)
      .order("rank", { ascending: true });

    if (error) {
      console.error("Error fetching favorite games:", error);
      return null;
    }

    const formattedGames = {};
    
    for (let i = 1; i <= 6; i++) {
      formattedGames[i] = null;
    }

    if (Array.isArray(data)) {
      data.forEach(item => {
        if (item.rank && item.games) {
          formattedGames[item.rank] = item.games;
        }
      });
    }

    return formattedGames;
  } catch (err) {
    console.error("Unexpected error fetching favorite games:", err);
    return null;
  }
};

export const removeFavoriteGame = async (userId, username, rank) => {
  if (!userId || !username || !rank) {
    console.error("User ID, username, and rank are required");
    return false;
  }
  
  try {
    const { error } = await supabase
      .from("favorite_games")
      .delete()
      .eq("profile_id", userId)
      .eq("profile_username", username)
      .eq("rank", rank);

    if (error) {
      console.error("Error removing favorite game:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Unexpected error removing favorite game:", err);
    return false;
  }
};

export const getUserPosts = async (username) => {
  if (!username) {
    console.error("Username is required for getUserPosts");
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from("post")
      .select("post_id, created_at, username, post_content, likes") // Removed post_attachment
      .eq("username", username)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user posts:", error);
      return null;
    }

    return data || [];
  } catch (err) {
    console.error("Unexpected error fetching user posts:", err);
    return null;
  }
};


export const deletePost = async (postId) => {
  if (!postId) {
    console.error("Post ID is required for deletion");
    return false;
  }
  
  try {
    const { error } = await supabase
      .from("post")
      .delete()
      .eq("post_id", postId);

    if (error) {
      console.error("Error deleting post:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Unexpected error deleting post:", err);
    return false;
  }
};