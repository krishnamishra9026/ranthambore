import {
	Component,
	OnInit,
	ElementRef,
	Output,
	ViewChild,
	EventEmitter,
	ChangeDetectorRef,
	Input
} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/_services';
import { TabsetComponent } from 'ngx-bootstrap';
import { SharedService } from 'src/app/_shared/shared.service';
import { ProductsService } from '../products.service';
import * as globals from '../../_shared/globals';
import { ValidationService } from 'src/app/_services/validation.service';

@Component({
	selector: 'app-manage',
	templateUrl: './manage.component.html',
	styleUrls: [ './manage.component.scss' ]
})
export class ManageComponent implements OnInit {
	@Output() response: EventEmitter<boolean> = new EventEmitter();
	@ViewChild('imgfile', { static: false }) imgfile: ElementRef;
	@ViewChild('productTabs', { static: true }) productTabs: TabsetComponent;
	@ViewChild('input', { static: true }) fileInput: ElementRef;

	productId = '';
	productForm: FormGroup;
	seoForm: FormGroup;
	selectedLogo: any = 'assets/images/edit-profile-pic.png';
	submitted = false;
	currentStep = 1;
	brandList: any[] = [];
	categoryList: any[] = [];
	subCategoryList: any[] = [];
	public images: string[] = [];
	public selectedImages: any[] = [];
	imagesToRemove: any[] = [];
	isActive: boolean;
	option: any = {};

	constructor(
		private commonService: CommonService,
		private formBuilder: FormBuilder,
		private sharedService: SharedService,
		private changeDetectorRef: ChangeDetectorRef,
		private productService: ProductsService
	) {
		this.createProductForm(this.option);
		this.createSeoForm(this.option);
		//this.initForm(this.option);
	}

	ngOnInit() {
		this.response = new EventEmitter();
		this.productTabs.tabs[1].disabled = true;
		this.productTabs.tabs[2].disabled = true;

		this.sharedService.getAllBrands().subscribe(
			(res: any) => {
				if (res && res.success) {
					this.brandList = res.data;
				}
			},
			(err) => {}
		);

		this.sharedService.getParentCategories().subscribe(
			(res: any) => {
				if (res && res.success) {
					this.categoryList = res.data;
				}
			},
			(err) => {}
		);

		if (this.productId) {
			// this.productTabs.tabs[1].disabled = false;
			// this.productTabs.tabs[2].disabled = false;
			this.productService.getProductDetail(this.productId).subscribe(
				(res: any) => {
					if (res && res.success) {
						//this.initForm(res.data);
						this.sharedService.getChildCategories(res.data.categoryId).subscribe(
							(res: any) => {
								if (res && res.success) {
									this.subCategoryList = res.data;
								}
							},
							(err) => {}
						);
						this.createProductForm(res.data);
						this.createSeoForm(res.data.metadata);
						this.isActive = res.data.status === 'Active' ? true : false;
						//this.seoForm.get('metadata').patchValue(res.data.metadata);
					}
				},
				(error: any) => {
					this.commonService.showError('', error.error.message);
				}
			);
		}
	}

	categoryChange(eve) {
		this.sharedService.getChildCategories(eve).subscribe(
			(res: any) => {
				if (res && res.success) {
					this.subCategoryList = res.data;
				}
			},
			(err) => {}
		);
	}

	toggleStatus() {
		this.isActive = !this.isActive;
	}
	productCreate() {
		const formData = new FormData();
		formData.append('name', this.productForm.controls.name.value);
		formData.append('shortDescription', this.productForm.controls.shortDescription.value);
		formData.append('brand', this.productForm.controls.brand.value);
		formData.append('category', this.productForm.controls.category.value);
		formData.append('subCategory', this.productForm.controls.subCategory.value);
		formData.append('regularPrice', this.productForm.controls.regularPrice.value);
		formData.append('discountedPrice', this.productForm.controls.discountedPrice.value);
		formData.append('status', this.isActive ? 'Active' : 'In Active');
		formData.append('metadata', JSON.stringify(this.seoForm.value.metadata));

		for (let img of this.images) {
			formData.append('images', img);
		}

		for (let img of this.imagesToRemove) {
			//formData.append('images[]', img);
			console.log(img);
			formData.append('imagesRemove[]', img._id);
		}

		// formData.forEach((key, val) => {
		// 	console.log(key, val);
		// });
		if (this.productId) {
			//console.log(this.productForm.get('images').value, JSON.stringify(this.imagesToRemove));
			//formData.append('imagesRemove', this.imagesToRemove);

			this.productService.updateproduct(this.productId, formData).subscribe(
				(res: any) => {
					if (res && res.success) {
						this.response.emit(res);
					} else {
						this.commonService.showError('', res.message);
					}
				},
				(err) => {
					this.commonService.showError('', err.error ? err.error.message : err);
				}
			);
		} else {
			this.productService.createProduct(formData).subscribe(
				(res: any) => {
					if (res && res.success) {
						this.response.emit(res);
					} else {
						this.commonService.showError('', res.message);
					}
				},
				(err) => {
					this.commonService.showError('', err.error ? err.error.message : err);
				}
			);
		}
	}

	get productFrm() {
		return this.productForm.controls;
	}
	onFileChange(event) {
		if (event.target.files && event.target.files.length !== globals.validImagesAllowedLimit) {
			var totalLenght = this.images.length + event.target.files.length;
			if (totalLenght > globals.validImagesAllowedLimit) {
				this.commonService.showError(
					'',
					`Only ${globals.validImagesAllowedLimit} images are allowed per product.`
				);
				return false;
			}
			for (let file of event.target.files) {
				if (file.size > globals.validImageSize) {
					this.commonService.showError('', 'Product image should be of 1 MB max.');
					return false;
				}

				this.images.push(file);
				this.commonService.getBase64(file).then((res) => {
					this.selectedImages.push({
						name: file.name,
						url: res
					});
				});
			}
		} else {
			this.commonService.showError('', `Only ${globals.validImagesAllowedLimit} images are allowed per product.`);
		}
	}

	closeModal() {
		this.response.emit();
	}

	// private initForm(values: any) {
	// 	console.log(values);
	// 	this.productForm = this.formBuilder.group({
	// 		name: new FormControl(values.name ? values.name : '', [ Validators.required, , Validators.maxLength(50) ]),
	// 		shortDescription: new FormControl(values.shortDescription ? values.shortDescription : '', [
	// 			Validators.required,
	// 			,
	// 			Validators.maxLength(150)
	// 		]),
	// 		brand: new FormControl(values.brand ? values.brand : null),
	// 		categoryId: new FormControl(values.categoryId ? values.categoryId : null),
	// 		subCategoryId: new FormControl(values.subCategoryId ? values.subCategoryId : null),
	// 		regularPrice: new FormControl(values.regularPrice ? values.regularPrice : null),
	// 		discountedPrice: new FormControl(values.discountedPrice ? values.discountedPrice : null),
	// 		selectedImages: values.images,
	// 		status: new FormControl(values.status ? values.status : false)
	// 	});
	// }

	private createProductForm(values: any) {
		if (values.images) {
			values.images.map((img) => {
				this.selectedImages.push({
					name: img.name,
					url: img.url,
					_id: img._id
				});
			});
		}

		this.productForm = this.formBuilder.group({
			shortDescription: [
				values.shortDescription ? values.shortDescription : '',
				[ Validators.required, , Validators.maxLength(150) ]
			],
			name: [ values.name ? values.name : '', [ Validators.required, Validators.maxLength(50) ] ],
			brand: [ values.brand ? values.brand : null, Validators.required ],
			category: [ values.categoryId ? values.categoryId : null, Validators.required ],
			subCategory: [ values.subCategoryId ? values.subCategoryId : null, Validators.required ],
			regularPrice: [
				values.regularPrice ? values.regularPrice : '',
				[ Validators.required, Validators.pattern(/^[+]?([.]\d+|\d+[.]?\d*)$/) ]
			],
			discountedPrice: [
				values.discountedPrice,
				[ Validators.required, Validators.pattern(/^[+]?([.]\d+|\d+[.]?\d*)$/) ]
			],
			images: [ values.images ? values.images : null ],
			status: [ values.status ? values.status : false, Validators.required ]
		});
	}

	private createSeoForm(values: any) {
		this.seoForm = this.formBuilder.group({
			metadata: this.formBuilder.group({
				keyword: [ values && values.keyword ? values.keyword : '' ],
				title: [ values && values.title ? values.title : '' ],
				description: [ values && values.description ? values.description : '' ]
				//description: new FormControl(values && values.description ? values.description : '')
			})
		});
	}

	previous() {
		this.currentStep = this.currentStep - 1;
		this.productTabs.tabs[this.currentStep - 1].active = true;
	}

	next() {
		switch (this.currentStep) {
			case 1:
				this.submitted = true;

				if (this.productForm.invalid) {
					return false;
				}

				this.productTabs.tabs[1].disabled = false;
				this.productTabs.tabs[1].active = true;
				this.currentStep = this.currentStep + 1;

				break;
			case 2:
				if (this.images.length === 0 && this.selectedImages.length === 0) {
					this.commonService.showError('', 'Please select atleast one image to continue.');
					return false;
				}
				this.currentStep = this.currentStep + 1;
				this.productTabs.tabs[2].disabled = false;
				this.productTabs.tabs[2].active = true;
				break;
			case 3:
				this.productCreate();
				break;
			default:
				break;
		}
	}

	// image uploader

	fileChange(input) {
		this.readFiles(input.files);
	}

	// readFile(file, reader, callback) {
	// 	reader.onload = () => {
	// 		callback(reader.result);
	// 	};
	// 	reader.readAsDataURL(file);
	// }

	readFiles(files, index = 0) {
		let reader = new FileReader();

		if (index in files) {
			if (files[index].size > globals.validImageSize) {
				this.commonService.showError('', 'Product image should be of 1 MB max.');
				this.fileInput.nativeElement.value = '';
				return false;
			}
			this.images.push(files[index]);

			// this.commonService.getBase64(files[index]).then((resImage) => {
			// 	this.selectedLogo = resImage;

			// 	if (index < 5) {
			// 		this.images.push(this.selectedLogo);
			// 		//this.productForm.get('images').setValue(this.images);
			// 		this.readFiles(files, index + 1);
			// 	} else {
			// 		this.fileInput.nativeElement.value = '';
			// 	}
			// });

			// this.readFile(files[index], reader, (result) => {
			// 	if (index < 5) {
			// 		this.images.push(result);
			// 		this.productForm.get('images').setValue(this.images);
			// 		this.readFiles(files, index + 1);
			// 	} else {
			// 		this.fileInput.nativeElement.value = '';
			// 	}
			// });
		} else {
			this.changeDetectorRef.detectChanges();
		}
	}

	removeImage(index): void {
		this.imagesToRemove.push(this.selectedImages.splice(index, 1)[0]);
	}
}
