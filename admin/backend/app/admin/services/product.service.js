import mongoose from 'mongoose';
import Product from '../../models/product.model';
import BaseService from '../../services/base.service';
import utils from '../../utils';
import config from '../../config';
import amazonService from '../../utils/amazon.service';
import objectService from './object.service';

const { ObjectId } = mongoose.Types.ObjectId;
class ProductsService extends BaseService {
	constructor() {
		super(Product);
	}

	getModel = () => Product;

	create = async (req, postData) => {
		const product = {
			name: postData.name,
			brand: postData.brand,
			metadata: JSON.parse(postData.metadata),
			shortDescription: postData.shortDescription,
			status: postData.status
		};
		product.slug = utils.generateSlug(postData.name);
		product.images = [];
		product.createdBy = req.user._id;
		product.category = postData.category;
		product.subCategory = postData.subCategory;

		product.regularPrice = postData.regularPrice;
		product.discountedPrice = postData.discountedPrice ? postData.discountedPrice : 0;

		const products = await this.getModel().create(product);
		if (products) {
			if (req.files && req.files.length > 0) {
				await Promise.all(
					req.files.map(async value => {
						const fileSizeInMB = value.size / 1000000;
						//utils.checkFileSizeInMB(req.file.size, 1);
						if (fileSizeInMB >= 1.0) {
							this.throwError('400', false, 'Image size must be of 1MB or less');
						} else if (['image/png', 'image/jpg', 'image/jpeg'].indexOf(value.mimetype) == -1) {
							this.throwError('400', false, 'Only Image allowed of jpg, jpeg or png type.');
						} else {
							const fileName = `${String(new Date().getTime())}-${utils.getImageName(
								value.originalname,
							)}`;
							await amazonService.saveFile(value, config.uploadPath.products + fileName);
							products.image = fileName;
							products.images.push({
								name: fileName,
								sort_order: 1,
								isDefault: true,
							});

						}
					}),
				);
				await products.save();
			}
			return products;
		}
		return products;
	};

	update = async (req, postData) => {
		const product = await this.getById(req.params.id);
		if (product) {
			product.name = postData.name;
			product.shortDescription = postData.shortDescription;
			product.metadata = JSON.parse(postData.metadata);
			product.url = utils.generateSlug(postData.name);
			product.updatedBy = req.user._id;
			product.regularPrice = postData.regularPrice;
			product.discountedPrice = postData.discountedPrice;
			product.status = postData.status;
			const products = await product.save();

			if (req.body.imagesRemove && req.body.imagesRemove.length) {
				await Promise.all(
					req.body.imagesRemove.map(async (img) => {
						console.log(req.body.imagesRemove);
						const fileName = product.images.id(img).name;
						console.log(fileName);
						const deleteFile = await amazonService.deleteObject(config.uploadPath.products + fileName);
						product.images.id(img).remove();

					})
				);
				await product.save();
			}

			if (req.files && req.files.length > 0) {
				await Promise.all(
					req.files.map(async value => {
						const fileSizeInMB = value.size / 1000000;
						if (fileSizeInMB >= 1.0) {
							this.throwError('400', false, 'Image size must be of 1MB or less');
						} else if (['image/png', 'image/jpg', 'image/jpeg'].indexOf(value.mimetype) == -1) {
							this.throwError('400', false, 'Only Image allowed of jpg, jpeg or png type.');
						} else {
							const fileName = `${String(new Date().getTime())}-${utils.getImageName(
								value.originalname,
							)}`;
							await amazonService.saveFile(value, config.uploadPath.products + fileName);
							products.image = fileName;
							products.images.push({
								name: fileName,
								sort_order: 1,
								isDefault: true,
							});
							//await products.save();
						}
					}),
				);
				await products.save();
			}
			return products;
		}
		return product;
	};

	getByCondition = (query, options) => Product.paginate(query, options);

	uploadImage = async (req, postData) => {
		const product = await this.getById(req.params.id);
		if (product && req.files.image !== undefined) {
			const fileName = `${String(new Date().getTime())}-${utils.getImageName(req.files.image.name)}`;

			const saveFile = await amazonService.saveFile(req.files.image, config.uploadPath.products + fileName);

			if (product.images && product.images.length) {
				product.images.push({
					title: postData.title,
					name: fileName,
					sort_order: postData.sort_order || 0,
					isDefault: postData.isDefault,
				});
			} else {
				product.images = [
					{
						title: postData.title,
						name: fileName,
						sort_order: postData.sort_order || 0,
						isDefault: postData.isDefault,
					},
				];
			}
			product.updatedBy = req.user._id;
			return product.save();
		}
		return product;
	};

	deleteImage = async req => {
		return this.deleteImageById(req.params.id);
		// const product = await this.model.findOne({ 'images._id': req.params.id });
		// if (product) {
		//   const fileName = product.images.id(req.params.id).name;
		//   const deleteFile = await amazonService.deleteObject(config.uploadPath.products + fileName);
		//   product.images.id(req.params.id).remove();
		//   product.updatedBy = req.user._id;

		//   return product.save();
		// }
		// return product;
	};

	list = async req => {
		const filters = req.body.filters || [];
		let keyword = req.body.keyword || '';
		const startDate = req.body.startDate || '';
		const endDate = req.body.endDate || '';
		keyword = utils.escape(keyword.trim());
		const offset = parseInt(req.body.offset, 10) || 0;
		const limit = parseInt(req.body.limit, 10) || 10;
		let sort = { created: 'desc' };
		const sortKey = req.body.sort ? Object.keys(req.body.sort) : [];
		if (sortKey.length && ['name', 'status', 'created'].indexOf(sortKey[0]) > -1) {
			sort = {};
			if (sortKey[0] === 'name') {
				sort.name = req.body.sort.name;
			} else {
				sort[sortKey] = req.body.sort[sortKey];
			}
		}

		const selectFields = {
			name: 1,
			category: 1,
			subCategory: 1,
			sort_order: 1,
			regularPrice: 1,
			status: 1,
			created: 1,
			images: 1,
		};

		const AND = [{ deleted: false }];

		if (filters.length > 0) {
			filters.forEach(filter => {
				if (Object.keys(filter)[0] === 'name' && filter.name) {
					AND.push({
						name: new RegExp(`.*${filter.name}.*`, 'gi'),
					});
				}
			});
		}

		if (req.user.roleId.toString() !== req.app.locals.SUPER_ADMIN_ROLE_ID.toString()) {
			AND.push({ createdBy: req.user._id });
		}

		if (keyword) {
			AND.push({
				$or: [{ name: new RegExp(`.*${keyword}.*`, 'gi') }, { status: new RegExp(`.*${keyword}.*`, 'gi') }],
			});
		}

		if (startDate && endDate) {
			AND.push({
				$or: [{ created: { $gte: new Date(startDate), $lte: new Date(endDate) } }],
			});
		}
		const result = await this.getByCondition(
			{
				$and: AND,
			},
			{
				select: selectFields,
				populate: [
					{
						path: 'category',
						select: { name: 1 },
					},
					{
						path: 'subCategory',
						select: { name: 1 },
					},
				],
				sort,
				offset,
				limit,
			},
		);
		if (result.docs.length) {
			const docs = [];
			result.docs.forEach(option => {
				const doc = objectService.getProductObject(option, true);
				docs.push(doc);
			});
			result.docs = docs;
		}
		return result;
	};

	changeStatus = async data => {
		data = data.body;
		if (data.status === 'Delete') {
			const product = await this.updateStatus(data.ids, { deleted: true });
			return product;
		}
		const product = await this.updateStatus(data.ids, { status: data.status });
		return product;
	};

	deleteImageById = async imageId => {
		const product = await this.model.findOne({ 'images._id': imageId });
		if (product) {
			const fileName = product.images.id(imageId).name;
			const deleteFile = await amazonService.deleteObject(config.uploadPath.products + fileName);
			product.images.id(imageId).remove();
			product.updatedBy = req.user._id;

			return product.save();
		}
		return product;
	}
}

export default new ProductsService();
