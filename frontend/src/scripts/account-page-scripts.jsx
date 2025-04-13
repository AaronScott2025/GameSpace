import { createClient } from "@supabase/supabase-js";
import axios from "axios";
const supabaseUrl = import.meta.env.VITE_SUPABASE_REACT_APP_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_REACT_APP_API_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const updateUserPassword = async (newPassword) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) {
      console.error("Error updating password:", error.message);
      return false;
    }
    console.log("Password updated successfully:", data);
    return true;
  } catch (err) {
    console.error("Unexpected error updating password:", err);
    return false;
  }
};

export const handleGameSelection = async (userId, username, gameId, rank) => {
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
      // Otherwise, insert a new entry
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
  if (!file) return null;
  try {
    const { error: profileError } = await supabase
      .from("profiles")
      .select("*")
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
      .eq("id", userId)
      .select();
    if (updateError) {
      console.error(
        "Error updating profile with new profile_pic:",
        updateError.message
      );
      return null;
    }
    return publicUrl;
  } catch (err) {
    console.error("Unexpected error in uploadProfilePic:", err);
    return null;
  }
};

export const updateLinkedServices = async (userId, linkedServices) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update(linkedServices)
      .eq("id", userId)
      .select();
    if (error) {
      console.error("Error updating linked services:", error.message);
      return false;
    }
    console.log("Linked services updated:", data);
    return true;
  } catch (err) {
    console.error("Unexpected error updating linked services:", err);
    return false;
  }
};

export const getUserInfo = async (userId) => {
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
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ bio })
      .eq("id", userId)
      .select();
    if (error) {
      console.error("Error updating bio:", error.message);
      return false;
    }
    console.log("Bio updated successfully:", data);
    return true;
  } catch (err) {
    console.error("Unexpected error updating bio:", err);
    return false;
  }
};

export const generateProfilePic = async (userId, prompt) => {
  try {
    const response = await axios.post("/api/logogen/", {
      prompt,
    });

    const imageUrl = response.data.generated?.[0]?.url;
    if (!imageUrl) {
      console.error("Error: No image URL returned from API.");
      return null;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ profile_pic: imageUrl })
      .eq("id", userId);

    if (error) {
      console.error(
        "Error updating profile with generated image:",
        error.message
      );
      return null;
    }

    return imageUrl;
  } catch (err) {
    console.error("Unexpected error in generateProfilePic:", err);
    return null;
  }
};

export const generateUsername = async (userId, message) => {
  if (!message || typeof message !== "string") {
    console.error("Invalid message provided:", message);
    return null;
  }

  try {
    console.log("Sending payload to /api/namegen/:", { message });
    const response = await axios.post("/api/namegen/", { message });

    console.log("API response:", response.data);
    const newUsername = response.data.response?.trim(); // Extract and trim the username
    if (!newUsername) {
      console.error("Error: No username returned from API.");
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
    console.error(
      "Unexpected error in generateUsername:",
      err.response?.data || err.message
    );
    return null;
  }
};

export const getFavoriteGames = async (userId, username) => {
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

    data.forEach(item => {
      formattedGames[item.rank] = item.games;
    });

    return formattedGames;
  } catch (err) {
    console.error("Unexpected error fetching favorite games:", err);
    return null;
  }
};

export const removeFavoriteGame = async (userId, username, rank) => {
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