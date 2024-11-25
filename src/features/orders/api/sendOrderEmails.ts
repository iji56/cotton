import { checkUserMigrationStatus } from '@/features/auth/api/userMigrationStatus';
import { supabase } from '@/lib/supabase';
import { keywords } from '../utils/keywords';
import { sendEmail } from '@/utils/sendEmail';
import { ImageCompressor } from '../utils/imageCompressor';
import { imageBaseUrl } from '@/utils/createStorageURL';
import { getUserData } from './getUserData';
import calculateTotalEarnings from '@/utils/calculateTotalEarnings';

import fs from 'react-native-fs';

const sendOnAcceptBuyShippingEmails = async (
  listing,
  sellerInfo,
  buyerInfo,
  method,
  shipmentArtifect
) => {
  try {
    console.log('starting sendOnAcceptBuyShippingEmails');
    console.log('---------listing', JSON.stringify(listing, null, 2));
    console.log('sellerInfo', sellerInfo);
    console.log('buyerInfo', buyerInfo);
    console.log('method', method);
    const labelData = await fs.readFile(shipmentArtifect, 'base64');
    console.log("here1")
  const labelBase64 = labelData.toString();
  console.log("here2")

    let buyerName = buyerInfo.first_name 
    if(buyerInfo.last_name){
      buyerName = buyerName = buyerInfo.last_name
    }
    let sellerName = buyerInfo.first_name 

    if(sellerInfo.last_name){
        sellerName = sellerName = buyerInfo.last_name
      }
    console.log("-------------------buyerName", buyerName)
    const buyEmailTemplateInfo = {
      [keywords.shipping]: {
        buyer: {
          templateName: 'Buy_shipping_buyer',
          replacements: {
            LISTING_NAME: listing.listing_name,
            SELLER_NAME: sellerName,
            TOTAL_COST: listing.total_price,
            ITEM_IMAGE: `${imageBaseUrl}${listing?.image_url}`,
          },
        },
        seller: {
          templateName: 'Buy_shipping_seller',
          replacements: {
            LISTING_NAME: listing.listing_name,
            BUYER_NAME: buyerName,
            TOTAL_EARNINGS: calculateTotalEarnings(listing.price_sale, listing.cost_shipping > 50 ? (listing.cost_shipping / 2).toFixed(2) : 0),
            ITEM_IMAGE: `${imageBaseUrl}${listing?.image_url}`,
            SHIPPING_DATE: listing.shipping_date.split('T')[0],
            ATTACHMENT: labelBase64,
          },
        },
      },
 
    };
    const sellerEmail = sellerInfo.email;

    const sellerEmailTemplate =
      buyEmailTemplateInfo[method].seller.templateName;
    const sellerEmailReplacements =
      buyEmailTemplateInfo[method].seller.replacements;

    const sellerEmailResult = await sendEmail(
      sellerEmailTemplate,
      sellerEmailReplacements,
      sellerEmail,
    );
    console.log('sellerEmail Result', sellerEmailResult);

    const buyerEmail = buyerInfo.email;
    const buyerEmailTemplate = buyEmailTemplateInfo[method].buyer.templateName;
    const buyerEmailReplacements =
      buyEmailTemplateInfo[method].buyer.replacements;

    const buyerEmailResult = await sendEmail(
      buyerEmailTemplate,
      buyerEmailReplacements,
      buyerEmail,
    );
    console.log('buyerEmail Result', buyerEmailResult);
  } catch (error) {
    console.error('Error in function sendOnAcceptBuyShippingEmails emails', error);
  }
};

const sendOnAcceptBuyLocalPickupEmails = async (
  listing,
  sellerInfo,
  buyerInfo,
  method,
) => {
  try {
    console.log('starting sendOnAcceptBuyLocalPickupEmails');
    console.log('---------listing', JSON.stringify(listing, null, 2));
    console.log('sellerInfo', sellerInfo);
    console.log('buyerInfo', buyerInfo);
    console.log('method', method);
    let buyerName = buyerInfo.first_name 
    if(buyerInfo.last_name){
      buyerName = buyerName = buyerInfo.last_name
    }
    let sellerName = buyerInfo.first_name 

    if(sellerInfo.last_name){
        sellerName = sellerName = buyerInfo.last_name
      }
    const buyEmailTemplateInfo = {
          [keywords.localPickup]: {
        buyer: {
          templateName: 'Buy_local_pickup_buyer',
          replacements: {
            LISTING_NAME: listing.listing_name,
            SELLER_NAME: sellerName,
            TOTAL_COST: listing.total_price,
            ITEM_IMAGE: `${imageBaseUrl}${listing?.image_url}`,
            CHAT_DEEPLINK: 'CHAT_DEEPLINK',
            ORDER_DETAILS_DEEPLINK: 'ORDER_DETAILS_DEEPLINK',
          },
        },
        seller: {
          templateName: 'Buy_local_pickup_seller',
          replacements: {
            LISTING_NAME: listing.listing_name,
            BUYER_NAME: buyerName,
            TOTAL_EARNINGS: calculateTotalEarnings(listing.price_sale, 0 ),
            CHAT_DEEPLINK: 'CHAT_DEEPLINK',
            ITEM_IMAGE: `${imageBaseUrl}${listing?.image_url}`,
            BUY_DATE: listing.local_pickup_date.split('T')[0],
          },
        },
      },
    };
    const sellerEmail = sellerInfo.email;

    const sellerEmailTemplate =
      buyEmailTemplateInfo[method].seller.templateName;
    const sellerEmailReplacements =
      buyEmailTemplateInfo[method].seller.replacements;

    const sellerEmailResult = await sendEmail(
      sellerEmailTemplate,
      sellerEmailReplacements,
      sellerEmail,
    );
    console.log('sellerEmail Result', sellerEmailResult);

    const buyerEmail = buyerInfo.email;
    const buyerEmailTemplate = buyEmailTemplateInfo[method].buyer.templateName;
    const buyerEmailReplacements =
      buyEmailTemplateInfo[method].buyer.replacements;

    const buyerEmailResult = await sendEmail(
      buyerEmailTemplate,
      buyerEmailReplacements,
      buyerEmail,
    );
    console.log('buyerEmail Result', buyerEmailResult);
  } catch (error) {
    console.error('Error in function sendOnAcceptBuyLocalPickupEmails emails', error);
  }
};

const sendOnAcceptBorrowShippingEmails = async (
  listing,
  lenderInfo,
  borrowerInfo,
  method: string,
  shipmentArtifect
) => {
  try {
    console.log('starting sendOnAcceptBorrowShippingEmails');
    console.log('---------listing', JSON.stringify(listing, null, 2));
    console.log('lenderInfo', lenderInfo);
    console.log('borrowerInfo', borrowerInfo);
    const labelData = await fs.readFile(shipmentArtifect, 'base64');
  const labelBase64 =  labelData.toString();
    const lendEmailTemplateInfo = {
      [keywords.shipping]: {
        borrower: {
          templateName: 'Borrow_confirmation',
          replacements: {
            LISTING_NAME: listing.listing_name,
            BORROW_START: listing.borrow_start.split('T')[0],
            BORROW_END: listing.borrow_end.split('T')[0],
            TOTAL_PRICE: listing.total_price,
            BORROW_METHOD: keywords.shipping,
            ITEM_IMAGE: `${imageBaseUrl}${listing?.image_url}`,
            
          },
        },
        lender: {
          templateName: 'Lend_confirmation_shipping',
          replacements: {
            LISTING_NAME: listing.listing_name,
            BORROW_START: listing.borrow_start.split('T')[0],
            BORROW_END: listing.borrow_end.split('T')[0],
            BORROW_METHOD: keywords.shipping,
            TOTAL_EARNINGS: listing.price_borrow * 0.8,
            PAYMENT_AVAILABLE_DATE: listing.borrow_end.split('T')[0],
            PAYOUT_DEEPLINK: 'PAYOUT_DEEPLINK',
            ATTACHMENT:  labelBase64,
            ITEM_IMAGE: `${imageBaseUrl}${listing?.image_url}`,

          },
        },
      },
    };

    const lenderEmail = lenderInfo.email;

    const lenderEmailTemplate =
      lendEmailTemplateInfo[method].lender.templateName;
    const lenderEmailReplacements =
      lendEmailTemplateInfo[method].lender.replacements;
console.log("------------lenderEmailReplacements", lenderEmailReplacements)
    const lenderEmailResult = await sendEmail(
      lenderEmailTemplate,
      lenderEmailReplacements,
      lenderEmail,
    );

    console.log('lenderEmail Result', lenderEmailResult);

    const borrowerEmail = borrowerInfo.email;
    const borrowerEmailTemplate =
      lendEmailTemplateInfo[method].borrower.templateName;
    const borrowerEmailReplacements =
      lendEmailTemplateInfo[method].borrower.replacements;

    const borrowerEmailResult = await sendEmail(
      borrowerEmailTemplate,
      borrowerEmailReplacements,
      borrowerEmail,
    );
    console.log('buyerEmail Result', borrowerEmailResult);
  } catch (error) {
    console.error('Error in function sendOnAcceptBorrowShippingEmails emails', error);
  }
};

const sendOnAcceptBorrowLocalPickupEmails = async (
  listing: OrderListing,
  lenderInfo,
  borrowerInfo,
  method: string,
) => {
  try {
    console.log('starting sendOnAcceptBorrowLocalPickupEmails');
    console.log('---------listing', JSON.stringify(listing, null, 2));
    console.log('lenderInfo', lenderInfo);
    console.log('borrowerInfo', borrowerInfo);
    console.log('method', method);
    const lendEmailTemplateInfo = {
      [keywords.localPickup]: {
        borrower: {
          templateName: 'Borrow_local_pickup',
          replacements: {
            LISTING_NAME: listing.listing_name,
            BORROW_START: listing.borrow_start.split('T')[0],
            BORROW_END: listing.borrow_end.split('T')[0],
            TOTAL_PRICE: listing.price_borrow,
            ITEM_IMAGE: `${imageBaseUrl}${listing?.image_url}`,
            METHOD: keywords.shipping,
          },
        },
        lender: {
          templateName: 'Lend_local_pickup',
          replacements: {
            LISTING_NAME: listing.listing_name,
            BORROW_START: listing.borrow_start.split('T')[0],
            BORROW_END: listing.borrow_end.split('T')[0],
            BORROW_METHOD: keywords.localPickup,
            TOTAL_EARNINGS: listing.price_borrow * 0.8,
            CHAT_DEEPLINK: 'CHAT_DEEPLINK',
            ITEM_IMAGE: `${imageBaseUrl}${listing?.image_url}`,
          },
        },
      },
    };

    const lenderEmail = lenderInfo.email;

    const lenderEmailTemplate =
      lendEmailTemplateInfo[method].lender.templateName;
    const lenderEmailReplacements =
      lendEmailTemplateInfo[method].lender.replacements;

    const lenderEmailResult = await sendEmail(
      lenderEmailTemplate,
      lenderEmailReplacements,
      lenderEmail,
    );

    console.log('lenderEmail Result', lenderEmailResult);

    const borrowerEmail = borrowerInfo.email;
    const borrowerEmailTemplate =
      lendEmailTemplateInfo[method].borrower.templateName;
    const borrowerEmailReplacements =
      lendEmailTemplateInfo[method].borrower.replacements;

    const borrowerEmailResult = await sendEmail(
      borrowerEmailTemplate,
      borrowerEmailReplacements,
      borrowerEmail,
    );
    console.log('buyerEmail Result', borrowerEmailResult);
  } catch (error) {
    console.error('Error in function sendOnAcceptBorrowLocalPickupEmails emails', error);
  }
};


export { sendOnAcceptBuyLocalPickupEmails, sendOnAcceptBuyShippingEmails, sendOnAcceptBorrowLocalPickupEmails, sendOnAcceptBorrowShippingEmails };
