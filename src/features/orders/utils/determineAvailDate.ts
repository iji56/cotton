export const determineAvailDate = (orderType: string, endDate: { setDate: (arg0: any) => any; getDate: () => number; }) => {
	if ('Shipping' === orderType){
		let ned = endDate.setDate(endDate.getDate() + 5);

		return ned;
	} else if ('Pickup' === orderType) {
		let ned = endDate.setDate(endDate.getDate() + 2);

		return ned
	} else {
		let ned = endDate.setDate(endDate.getDate() + 5);

		return ned
	}
}