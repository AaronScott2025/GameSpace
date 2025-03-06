// account-page-scripts.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://xfmccwekbxjkrjwuheyv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmbWNjd2VrYnhqa3Jqd3VoZXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNzk1MzcsImV4cCI6MjA1NDk1NTUzN30.ImuaZwH7dkETwZR_3i4GsTEVhGDev-RjbgnKUX_rLfQ'
);

export const handleGameSelection = (gameName) => {
    console.log("Selected favorite game:", gameName);

};

export const getUserInfo = async (userId) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('username, email')
        .eq('id', userId)
        .single();

    if (error) {
        console.error("Error fetching user info:", error);
        return null;
    }

    return data;
};
