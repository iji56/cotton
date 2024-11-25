import { supabase } from '@/lib/supabase';

export const saveReview = async (listingId: string, purchaserOrBorrowerId: string, ownerOrLenderId: string, type: 1 | 2 | 3 | 4, title: string, description: string, video: string, image: string, rating: number) => {
    const payload = {
        p_listing_id: listingId,
        p_purchaser_or_borrower_id: purchaserOrBorrowerId,
        p_owner_or_lender_id: ownerOrLenderId,
        p_review_type: type,
        p_review_title: title,
        p_review_description: description,
        p_video_link: video,
        p_image_link: image,
        p_rating: rating
    }
    const { data, error } = await supabase.rpc('insert_review', payload)

    if (error) {
        console.error('Error adding review:', error.message);
        return null;
    }
    console.log("review response  :", data)
    return data;
}
