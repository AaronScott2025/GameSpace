import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_REACT_APP_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_REACT_APP_API_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const updateUserPassword = async (newPassword) => {
    try {
        const { data, error } = await supabase.auth.updateUser({ password: newPassword });
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

export const handleGameSelection = (gameName) => {
    console.log("Selected favorite game:", gameName);
};

export const uploadProfilePic = async (userId, file) => {
    if (!file) return null;
    try {
        const { error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (profileError) {
            console.error("Error fetching profile:", profileError);
            return null;
        }
        const fileExt = file.name.split('.').pop().toLowerCase();
        const fileName = `profile_${userId}_${Date.now()}.${fileExt}`;
        const filePath = fileName;
        const { error: uploadError } = await supabase
            .storage
            .from('profile_pics')
            .upload(filePath, file, { upsert: true });
        if (uploadError) {
            console.error("Error uploading file:", uploadError.message);
            return null;
        }
        const { data: publicUrlData } = supabase
            .storage
            .from('profile_pics')
            .getPublicUrl(filePath);
        const publicUrl = publicUrlData.publicUrl;
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ profile_pic: publicUrl })
            .eq('id', userId)
            .select();
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
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update(linkedServices)
            .eq('id', userId)
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
            .from('profiles')
            .select('username, email, profile_pic, bio, steam_link, Epic_link, PSN_link, Xbox_link, Discord_link')
            .eq('id', userId)
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
            .from('profiles')
            .update({ bio })
            .eq('id', userId)
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
