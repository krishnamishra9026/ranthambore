import config from '../../config';
import utils from '../../utils';

/**
 * Get user object to return in response
 * @param {Object} item User detail to transform
 *
 * @return User detail object
 */
class ObjectService {
	getUserListObject = (item, withImage) => {
	  const doc = {
	    id: item._id,
	    name: item.fullName,
	    email: item.email,
	    mobile: item.mobile ? item.mobile : '',
	    phone: item.phone ? item.phone : '',
	    gender: item.gender ? item.gender : '',
	    status: item.status,
	    created: utils.getDateInFormat(item.created),
	    country: item.country ? item.country : '',
	    categories: item.categories && item.categories.length ? item.categories : [],
	  };

	  if (withImage && withImage === true) {
	    doc.image =	item.profile_pic && item.profile_pic.length > 0
				  ? config.awsWebUrl + config.uploadPath.user + item.profile_pic[0]
				  : '';
	  }

	  return doc;
	};

	getSystemEmailObject = record => {
	  const doc = {
	    id: record.id,
	    title: utils.unescape(record.title),
	    code: utils.unescape(record.code),
	    subject: utils.unescape(record.subject),
	    fromName: utils.unescape(record.fromName),
	    fromEmail: utils.unescape(record.fromEmail),
	    variables: record.variables,
	    bcc: record.bcc ? utils.unescape(record.bcc) : '',
	    cc: record.cc ? utils.unescape(record.cc) : '',
	    message: utils.unescape(record.message),
	  };

	  return doc;
	};

	getCategoryDetailObject = item => {
	  const doc = {
	    id: item._id,
	    parent: item.parent,
	    active: item.active,
	    deleted: item.deleted,
	    name: item.name && item.name.length ? utils.unescape(item.name) : '',
	    description: utils.unescape(item.description) || '',
	  };

	  return doc;
	};


	getcambalBookingObject = item => {
	  const doc = {
	    id: item._id,
	    deleted: item.deleted,
	    active: item.active,
	    name: item.name && item.name.length ? utils.unescape(item.name) : '',
	    email: item.email && item.email.length ? utils.unescape(item.email) : '',
	    address: item.address && item.address.length ? utils.unescape(item.address) : '',
	    mobile: item.mobile && item.mobile.length ? utils.unescape(item.mobile) : '',
	    date: item.date && item.date.length ? utils.unescape(item.date) : '',
	    date_added: item.date_added && item.date_added.length ? utils.unescape(item.date_added) : '',
	    amount: item.amount && item.amount.length ? utils.unescape(item.amount) : '',
	    transaction_id: item.transaction_id && item.transaction_id.length ? utils.unescape(item.transaction_id) : '',
	  };

	  return doc;
	};


	getCustomerDetailObject = item => {
	  const doc = {
	     id: item._id,
		  name: item.name && item.name.length ? utils.unescape(item.name) : '',
		  address: item.address && item.address.length ? utils.unescape(item.address) : '',
		  description: item.description && item.description.length ? utils.unescape(item.description) : '',
		  email: item.email && item.email.length ? utils.unescape(item.email) : '',
		  active: item.active,
	  };

	  return doc;
	};




	getEventDetailObject = item => {
	  const doc = {
	  	id: item._id,
	    date: item.date && item.date.length ? utils.unescape(item.date) : '',
	    zone: item.zone && item.zone.length ? utils.unescape(item.zone) : '',
	    vehicle: item.vehicle && item.vehicle.length ? utils.unescape(item.vehicle) : '',
	    timing: item.timing && item.timing.length ? utils.unescape(item.timing) : '',
	    availability: item.availability && item.availability.length ? utils.unescape(item.availability) : '',
	    active: item.active,
	  };

	  return doc;
	};


	getustomerDetailObject = item => {
	  const doc = {
	    id: item._id,
	    parent: item.parent,
	    active: item.active,
	    deleted: item.deleted,
	    name: item.name && item.name.length ? utils.unescape(item.name) : '',
	  };

	  return doc;
	};

	getBrandDetailObject = item => {
	  const doc = {
	    id: item._id,
	    active: item.active,
	    deleted: item.deleted,
	    name: item.name && item.name.length ? utils.unescape(item.name) : '',
	  };

	  return doc;
	};

	getBannerDetailObject = item => {
	  const doc = {
	    id: item._id,
	    sort_order: item.sort_order || 0,
	    url: item.url,
	    title: utils.unescape(item.title) || '',
	    description: utils.unescape(item.description) || '',
	    active: item.active,
	  };

	  doc.icon = item.image ? `${config.s3.webUrl}/${config.uploadPath.banners + item.image}` : '';

	  return doc;
	};

	getLabelDetailObject = item => {
	  const doc = {
	    id: item._id,
	    title: utils.unescape(item.title) || '',
	    label: item.label,
	  };
	  return doc;
	};

	getBannerObject = item => {
	  const doc = {
	    id: item._id,
	    sort_order: item.sort_order || 0,
	    url: item.url,
	    category: item.category,
	    country:
				item.country && item.country.name && item.country.name.length ? utils.unescape(item.country.name) : '',
	    title: item.title && item.title.length ? utils.unescape(item.title) : '',
	    active: item.active,
	  };
	  return doc;
	};

	/**
	 * Get user object to return in response
	 * @param {Object} item User detail to transform
	 *
	 * @return User detail object
	 */
	getUserDetailObject = (item, withImage) => {
	  const doc = {
	    id: item.id,
	    name: item.fullName,
	    email: item.email,
	    mobile: item.mobile ? item.mobile : '',
	    phone: item.phone ? item.phone : '',
	    gender: item.gender ? item.gender : '',
	    status: item.status,
	    updated: utils.getDateInFormat(item.updated),
	    company: {
	      name: item.company.name,
	      businessType: item.company.businessType,
	      email: item.company.email,
	      fax: item.company.fax,
	      address: {
	        street: item.company.address.street,
	        landmark: item.company.address.landmark,
	        country: item.company.address.country,
	        state: item.company.address.state,
	        city: item.company.address.city,
	        postcode: item.company.address.postcode,
	      },
	    },
	  };

	  if (withImage && withImage === true) {
	    doc.image =				item.profile_pic && item.profile_pic.length > 0
				  ? config.awsWebUrl + config.uploadPath.user + item.profile_pic[0]
				  : '';
	  }

	  return doc;
	};

	/**
	 * Get role object to return in response
	 * @param {Object} item Role detail to transform
	 *
	 * @return Role detail object
	 */
	getRoleObject = item => {
	  const doc = {
	    id: item._id,
	    name: item.name,
	    slug: item.slug,
	  };
	  return doc;
	};

	/**
	 * Get capability object to return in response
	 * @param {Object} item Capability detail to transform
	 *
	 * @return Capability detail object
	 */
	getCapabilityObject = item => {
	  const doc = {
	    id: item._id,
	    name: utils.unescape(item.name),
	    slug: item.slug,
	    module: utils.unescape(item.module),
	  };
	  return doc;
	};

	/**
	 * Get page object to return in response
	 * @param {Object} item Page detail to transform
	 *
	 * @return Page detail object
	 */
	getPageObject = item => {
	  const doc = {
	    id: item._id,
	    name: item.name && item.name.length ? utils.unescape(item.name) : '',
	    code: item.code,
	    url: item.url,
	    description: unescape(item.description),
	    active: item.active,
	  };
	  return doc;
	};

	getPageDetailObject = item => {
	  const doc = {
	    id: item._id,
	    sort_order: item.sort_order || 0,
	    url: item.url,
	    code: item.code,
	    active: item.active,
	    name: item.name && item.name.length ? utils.unescape(item.name) : '',
	    description: item.description && item.description.length ? utils.unescape(item.description) : '',
	    metadata: {
	      title:
					item.metadata.title && item.metadata.title.length ? utils.unescape(item.metadata.title) : '' || '',
	      description:
					item.metadata.description && item.metadata.description.length
					  ? utils.unescape(item.metadata.description)
					  : '' || '',
	      keyword:
					item.metadata.keyword && item.metadata.keyword.length
					  ? utils.unescape(item.metadata.keyword)
					  : '' || '',
	    },
	  };
	  return doc;
	};

	getOptionObject = item => {
	  const doc = {
	    id: item._id,
	    type: item.type,
	    sort_order: item.sort_order || 0,
	    name: item.name && item.name.length ? utils.unescape(item.name[0].text) : '',
	    active: item.active,
	  };
	  return doc;
	};

	getProductObject = item => {
	  const doc = {
	    id: item._id,
	    name: item.name && item.name.length ? utils.unescape(item.name) : '',
	    category: item.category.name && item.category.name.length ? utils.unescape(item.category.name) : '',
	    subCategory:
				item.subCategory && item.subCategory.name && item.subCategory.name.length
				  ? utils.unescape(item.subCategory.name)
				  : '',
	    regularPrice: item.regularPrice,
	    discountedPrice: item.discountedPrice,
	    isFeatured: item.isFeatured,
	    images: item.images,
	    status: item.status,
	    created: utils.getDateInFormat(item.created),
	  };

	  doc.images.forEach(image => {
	    image.url = image.name ? `${config.s3.webUrl}/${config.uploadPath.products + image.name}` : image.name;
	  });
	  return doc;
	};

	getProductDetailObject = async item => {
	  const doc = {
	    id: item._id,
	    isFeatured: item.isFeatured,
	    category:
				item.category && item.category.name && item.category.name.length
				  ? utils.unescape(item.category.name)
				  : '',
	    subCategory:
				item.subCategory && item.subCategory.name && item.subCategory.name.length
				  ? utils.unescape(item.subCategory.name)
				  : '',
	    categoryId: item.category._id,
	    subCategoryId: item.subCategory._id,
	    brand: item.brand,
	    slug: item.slug,
	    regularPrice: item.regularPrice,
	    discountedPrice: item.discountedPrice ? item.discountedPrice : 0,
	    name: utils.unescape(item.name) || '',
	    shortDescription: item.shortDescription,
	    metadata: item.metadata,
	    images: item.images,
	    status: item.status,
	  };

	  doc.images.forEach(image => {
	    image.url = image.name ? `${config.s3.webUrl}/${config.uploadPath.products + image.name}` : image.name;
	  });

	  doc.values = item.values;
	  return doc;
	};

	getCateogryObject = item => {
	  const doc = {
	    id: item._id,
	    name: item.name && item.name.length ? utils.unescape(item.name) : '',
	    description: item.description && item.description.length ? utils.unescape(item.description) : '',
	    parent: '',
	    active: item.active,
	  };
	  if (item.parent && item.parent.name) {
	    doc.parent = utils.unescape(item.parent.name);
	  }

	  return doc;
	};


	getEventObject = item => {
		if (item.zone == 'Zone1') {
			item.zone = 'Zone 1/2/3/4/5';
		}else{
			item.zone = 'Zone 6/7/8/9/10';
		}
	  const doc = { 	
	    id: item._id,
	    date: item.date && item.date.length ? utils.unescape(item.date) : '',
	    zone: item.zone && item.zone.length ? utils.unescape(item.zone) : '',
	    vehicle: item.vehicle && item.vehicle.length ? utils.unescape(item.vehicle) : '',
	    timing: item.timing && item.timing.length ? utils.unescape(item.timing) : '',
	    availability: item.availability && item.availability.length ? utils.unescape(item.availability) : '',
	    active: item.active,
	  };
	  return doc;
	};

	getBookingPricesObject = item => {
	  const doc = { 	
	    id: item._id,
	    name: item.name && item.name.length ? utils.unescape(item.name) : '',
	    price: item.price && item.price ? item.price : '',
	  };
	  return doc;
	};

	getChambalPricesObject = item => {
	  const doc = { 	
	    id: item._id,
	    name: item.name && item.name.length ? utils.unescape(item.name) : '',
	    price: item.price && item.price ? item.price : '',
	  };
	  return doc;
	};



	getCustomerObject = item => {
		const doc = {
		  id: item._id,
		  name: item.name && item.name.length ? utils.unescape(item.name) : '',
		  address: item.address && item.address.length ? utils.unescape(item.address) : '',
		  mobile: item.mobile && item.mobile.length ? utils.unescape(item.mobile) : '',
		  email: item.email && item.email.length ? utils.unescape(item.email) : '',
		  active: item.active,
		};  
		return doc;
	  };

	getBrandObject = item => {
	  const doc = {
	    id: item._id,
	    name: item.name && item.name.length ? utils.unescape(item.name) : '',
	    active: item.active,
	  };
	  return doc;
	};

	getParentCatObject = ele => ({
	  id: ele.id,
	  name: ele.name && ele.name.length ? utils.unescape(ele.name) : '',
	});

	getChildCatObject = ele => {
	  const item = {
	    id: ele.id,
	    name: ele.name && ele.name.length ? utils.unescape(ele.name[0].text) : '',
	    parent: ele.parent ? ele.parent : '',
	  };
	  return item;
	};

	// getProductObject = item => {
	//   const doc = {
	//     id: item._id,
	//     name: item.name && item.name.length ? utils.unescape(item.name) : '',
	//     category: item.category.name && item.category.name.length ? utils.unescape(item.category.name) : '',
	//     subCategory:
	// 			item.subCategory && item.subCategory.name && item.subCategory.name.length
	// 			  ? utils.unescape(item.subCategory.name)
	// 			  : '',
	//     regularPrice: item.regularPrice,
	//     sort_order: item.sort_order || 0,
	//     status: item.status,
	//     created: utils.getDateInFormat(item.created),
	//   };
	//   return doc;
	// };

	getFaqObject = item => {
	  const doc = {
	    id: item._id,
	    question: item.question && item.question.length ? utils.unescape(item.question) : '',
	    answer: item.answer && item.answer.length ? utils.unescape(item.answer) : '',
	    seq_no: item.seq_no,
	    active: item.active,
	    created: utils.getDateInFormat(item.created),
	  };
	  return doc;
	};

	getFaqDetailObject = item => {
	  const doc = {
	    id: item._id,
	    active: item.active,
	    deleted: item.deleted,
	    question: item.question && item.question.length ? utils.unescape(item.question) : '',
	    answer: item.answer && item.answer.length ? utils.unescape(item.answer) : '',
	    seq_no: item.seq_no,
	    created: utils.getDateInFormat(item.created),
	  };

	  return doc;
	};
}

export default new ObjectService();
