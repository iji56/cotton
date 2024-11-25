import { checkUserMigrationStatus } from '@/features/auth/api/userMigrationStatus';
import { getUserData } from '@/features/orders/api/getUserData';
import { sendEmail } from '@/utils/sendEmail';
import { keywords } from '../utils/staticTexts';
import { imageBaseUrl } from '@/utils/createStorageURL';
import calculateTotalEarnings from '@/utils/calculateTotalEarnings';

const sendOnRequestBuyEmails = async (
  listing,
  buyerInfo,
  method: string,
  deliveryCharge
) => {
  console.log('---------------listing', JSON.stringify(listing, null, 2));
  console.log('------sendOnRequestBuyEmails', method);
  console.log('------sendOnRequestBuyEmails', buyerInfo);

  const buyTemplates = {
    [keywords.shipping]: {
      isMigrated: 'Buy_shipping',
      isNotMigrated: 'Buy_new_app_shipping',
    },
    [keywords.localPickup]: {
      isMigrated: 'Buy_localpickup',
      isNotMigrated: 'Buy_new_app_localpickup',
    },
  };
  //get seller user_meta
  const response = await getUserData(listing?.userID);
  const sellerEmail = response[0].user_info.email;
  //check if they are migrated
  const status = await checkUserMigrationStatus(sellerEmail);
  console.log('status', status);
  //select template based on if they have migrated, 0 = migrated, anything else no
  const template =
    status === 0
      ? buyTemplates[method].isMigrated
      : buyTemplates[method].isNotMigrated;
  // let base64Image = await fs.readFile(compressedFilePath, 'base64');
  const totalEarnings = calculateTotalEarnings(listing.salePrice, deliveryCharge > 50 ? (deliveryCharge / 2).toFixed(2) : 0);

  console.log('totalEarnings', totalEarnings);

  const sellerReplacements = {
    LISTING_NAME: listing.name,
    ITEM_IMAGE: `${imageBaseUrl}${listing?.images[0]?.url_path}`,
    TOTAL_EARNINGS: totalEarnings,
  };
  console.log(
    '---------------sending email for ',
    template,
    sellerReplacements,
    sellerEmail,
  );
  const buyerEmailResult = await sendEmail(
    template,
    sellerReplacements,
    sellerEmail || '',
  );
  console.log('send result sendOnRequestBuyEmails ', buyerEmailResult);
  return 'successfully sent sendOnRequestBuyEmails emails';
};

const sendOnRequestBorrowEmails = async (
  listing,
  borrowStart: string,
  borrowEnd: string,
  buyerInfo,
  method: string,
  deliveryCharge: number
) => {
  try {
    console.log('---------------listing', JSON.stringify(listing, null, 2));
    console.log('------sendOnRequestBorrowEmails', method);
    console.log('------sendOnRequestBorrowEmails', buyerInfo);

    const buyTemplates = {
      [keywords.shipping]: {
        isMigrated: 'Lend_shipping',
        isNotMigrated: 'Lend_new_app_shipping',
      },
      [keywords.localPickup]: {
        isMigrated: 'Lend_localpickup',
        isNotMigrated: 'Lend_new_app_localpickup',
      },
    };
    //get seller user_meta
    const response = await getUserData(listing?.userID);
    const sellerEmail = response[0].user_info.email;
    //check if they are migrated
    const status = await checkUserMigrationStatus(sellerEmail);
    console.log('status', status);
    //select template based on if they have migrated, 0 = migrated, anything else no
    const template =
      status === 0
        ? buyTemplates[method].isMigrated
        : buyTemplates[method].isNotMigrated;
    console.log('template', template);
    const totalEarnings = calculateTotalEarnings(listing.priceBorrow, deliveryCharge > 50 ? (deliveryCharge / 2).toFixed(2) : 0);
    const lenderReplacements = {
      LISTING_NAME: listing.name,
      BORROW_START: borrowStart,
      BORROW_END: borrowEnd,
      ITEM_IMAGE: `${imageBaseUrl}${listing?.images[0]?.url_path}`,
      TOTAL_EARNINGS: totalEarnings,
    };
    console.log(
      '---------------sending email for ',
      'Buy_shipping',
      lenderReplacements,
      sellerEmail,
    );
    const buyerEmailResult = await sendEmail(
      template,
      lenderReplacements,
      sellerEmail || '',
    );
    console.log('send result Borrow_shipping ', buyerEmailResult);

    return 'successfully sent sendOnRequestBorrowEmails emails';
  } catch (error) {
    console.error('Error in sendOnRequestBorrowEmails: ', error);
  }
};

export { sendOnRequestBuyEmails, sendOnRequestBorrowEmails };