import { Route, Routes } from 'react-router-dom'
import './App.css'
import { AdminDashboard } from './layouts/adminDashboard'
import DashboardHome from './pages/DashboardHome'
import { Product } from './pages/products/Product'
import { Login } from './components/Login'
import { Toaster } from 'sonner'
import { Category } from './components/category'
import { Order } from './pages/Order'
import { AddBlog } from './pages/blog/AddBlog'
import { BlogList } from './pages/blog/BlogList'
import { Notification } from './pages/Notification'
import { UserDetail } from './pages/user/UserDetail'
import { Review } from './pages/review/review'
import { Return } from './pages/Return'
import { QA } from './pages/qa/Qa'
import { HelpDashboard } from './pages/helpCenter/helpDashboard'
import { Contact } from './pages/helpCenter/Contact'
import { FAQs } from './pages/helpCenter/FAQs'
import { Coupon } from './pages/Coupon'
import { SalesReport } from './pages/report/Sales'
import { RevenueReport } from './pages/report/Revenue'
import { Analysis } from './pages/analysis/Analysis'
import { ProductAnalysis } from './pages/analysis/Product'
import { CustomerAnalysis } from './pages/user/Customer'
import { TrafficAnalysis } from './pages/analysis/Traffic'
import { Marketing } from './pages/marketing/Marketing'
import { Campaign } from './pages/marketing/Campaign'
import { FlashSales } from './pages/marketing/FlashSales'
import { Chat } from './pages/chat/Chat'
import { Banner } from './pages/marketing/Banner'

function App() {
  return (
    <>

      <Toaster position='top-right' duration={1500} richColors />

      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/admin" element={<AdminDashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="notifications" element={<Notification />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="products" element={<Product />} />
          <Route path="categories" element={<Category />} />
          <Route path="orders" element={<Order />} />
          <Route path="orders/return" element={<Return />} />
          <Route path="customers" element={<UserDetail />} />
          <Route path="chats" element={<Chat />} />
          <Route path="customers/customer-analysis" element={<CustomerAnalysis />} />
          <Route path="reviews" element={<Review />} />
          <Route path="qa" element={<QA />} />
          <Route path="helpcenter" element={<HelpDashboard />} >
            <Route index element={<FAQs />} />
            <Route path='contact' element={<Contact />} />
          </Route>

          <Route path='coupon' element={<Coupon />} />
          <Route path='blogs' element={<BlogList />} />
          <Route path='blogs/add-blog' element={<AddBlog />} />
          <Route path='sales-report' element={<SalesReport />} />
          <Route path='revenue-report' element={<RevenueReport />} />
          <Route path='analytics' element={<Analysis />} >
            <Route path="product-analysis" element={<ProductAnalysis />} />
            <Route path="traffic-analysis" element={<TrafficAnalysis />} />
          </Route>

          <Route path='marketing' element={<Marketing />} >
            <Route index element={<Campaign />} />
            <Route path="flash-sales" element={<FlashSales />} />
            <Route path="banner" element={<Banner />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}

export default App

