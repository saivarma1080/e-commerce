import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { RouterModule, Routes } from '@angular/router';
import {ToastrModule } from 'ngx-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { environment } from '../environments/environment.development';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './services/auth.service';
import { AdminModule } from './admin.module';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { ProductsComponent } from './components/products/products.component';
import { ShoppingCartService } from './services/shopping-cart.service';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';
import { OrderService } from './services/order.service';
import { OrderSuccessComponent } from './components/order-success/order-success.component';
import { CheckOutComponent } from './components/check-out/check-out.component';
import { MyOrdersComponent } from './components/my-orders/my-orders.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { UnAuthorizedComponent } from './components/un-authorized/un-authorized.component';
import { MyDashboardComponent } from './components/my-dashboard/my-dashboard.component';
import { WishlistService } from './services/wishlist.service';
import { WishlistComponent } from './components/wishlist/wishlist.component';


const routes:Routes=[
  { path: '', component: ProductsComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'shopping-cart', component: ShoppingCartComponent },
  {path:'login',component:LoginComponent},
  {path:'registration',component:RegistrationComponent},
  { path: 'check-out', component: CheckOutComponent,canActivate: [AuthGuard]},
  { path: 'order-detail/:id', component: OrderDetailComponent, canActivate: [AuthGuard] },
  { path: 'order-success/:id', component: OrderSuccessComponent, canActivate: [AuthGuard] },
  { path: 'my-orders', component: MyOrdersComponent, canActivate: [AuthGuard] },
  { path: 'my-dashboard', component: MyDashboardComponent },
  { path: 'my-wishlist', component: WishlistComponent, canActivate: [AuthGuard] },
  { path: 'un-authorized', component: UnAuthorizedComponent },
  { path: '**', component: NotFoundComponent }



  
]

@NgModule({
  declarations: [
    AppComponent,
   LoginComponent,
   RegistrationComponent,
   NavBarComponent,
   ProductsComponent,
   ShoppingCartComponent,
   CheckOutComponent,
   OrderSuccessComponent,
   MyOrdersComponent,
   OrderDetailComponent ,
   NotFoundComponent,
   UnAuthorizedComponent ,
   MyDashboardComponent,
   WishlistComponent
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
    positionClass:'toast-bottom-right',
    preventDuplicates:true,
    timeOut:2000}),
    NgxPaginationModule,
    RouterModule.forRoot(routes),
    AdminModule,
    AngularFireModule.initializeApp(environment.firebaseConfig)
  ],
  providers: [AuthService, 
    ProductService,
    CategoryService,
    ShoppingCartService,
    OrderService,
    WishlistService,
    AuthGuard,
    AdminGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
