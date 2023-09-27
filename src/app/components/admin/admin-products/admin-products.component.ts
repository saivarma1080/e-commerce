import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Category } from "src/app/models/category.model";
import { Product } from "src/app/models/product.model";
import { CategoryService } from "src/app/services/category.service";
import { ProductService } from "src/app/services/product.service";

@Component({
  selector: 'admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
  pageNumber: number = 1;
  products: Product[] = [];
  categories: Category[] = [];
  modalHeader: string = '';
  product = new Product();
  searchTerm: string;

  productForm = new FormGroup({
    title: new FormControl(null, Validators.required),
    price: new FormControl(0, Validators.required),
    category: new FormControl(null, Validators.required),
    imageUrl: new FormControl(null, Validators.required)
  });

  constructor(private productService: ProductService, private categoryService: CategoryService, private toastr: ToastrService) {
  }
  addProduct() {
    this.modalHeader = 'Add Product';
    this.product = new Product();
    this.productForm.reset();
  }
  editProduct(product: Product) {
    this.modalHeader = 'Edit Product';
    this.product = product;
  }
  deleteProduct(id: any) {
    this.productService.delete(id)
      .then((response) => {
        this.toastr.success('Product deleted successfully...!');
      })
      .catch((error: Response) => {
        this.toastr.error('Un-handled exception occured...!');
      });
  }
  saveProduct() {
    if (this.product.id) {
      this.productService.update(this.product.id, this.product)
        .then((response) => {
          this.toastr.success('Product updated successfully...!');
        })
        .catch((error: any) => {
          this.toastr.error('Un-handled exception occured...!');
        });
    }
    else {
      this.productService.create(this.product)
        .then((response) => {
          this.toastr.success('Product added successfully...!');
        })
        .catch((error: any) => {
          this.toastr.error('Un-handled exception occured...!');
        });
    }
  }
  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }
  loadProducts() {
    this.productService.read(this.searchTerm)
      .subscribe(response => {
        this.products = response.map((data) => {
          return {
            id: data.payload.doc.id,
            ...data.payload.doc.data() as Product
          }
        });
      })
  }

  loadCategories() {
    this.categoryService.read()
      .subscribe(response => {
        this.categories = response.map((data) => {
          return {
            id: data.payload.doc.id,
            ...data.payload.doc.data() as Category
          }
        });
      })
  }

  getCategory(categoryId: string) {
    let itemIndex = this.categories.findIndex(x => x.id === categoryId);
    return itemIndex > -1 ? this.categories[itemIndex].name: ""
  }
}