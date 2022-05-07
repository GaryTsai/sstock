# sstock

主要紀錄自己股票買賣的紀錄與損益，保存買賣資料。
### 主要使用 ReactJS + FireBase 實作

### Login 方式 
  - (1) 使用自己方便的emial(帳號)與密碼登入

### Firebase 資料庫(Realtime DataBase)
 
### 資料格式(JSON):
- 目前分為兩種表格account與expense:
```javascripts=
"account_Info" : {
    "oeSPUmB3mjUAe56nLSAKXZALMu43" : {
      "email" : "kest8088@yahoo.com.tw",
      "signup" : 1617429629939
    }
  },
 ```
 ```json=
"ruTFVENv84q6WVJkljeqQjyenmH7" : {
      "tw" : {
        "account_record" : {
          "1617590846" : {
            "account_record_Money" : -58983,
            "account_record_Stock" : 58983,
            "source" : "股票",
            "timestamp" : 1617590846,
            "transfer" : 58983,
            "transferStatus" : "存入",
            "transferTime" : "2021-04-05"
          }
      },
        "account_summary" : {
        "accountMoney" : 25000,
        "accountStock" : 125000,
        "accountTime" : "2021-04-05",
        "summary" : "150000"
      },
      "stock_info" : {
          "1617590846" : {
            "cost" : 58983,
            "date" : "2021-04-05",
            "income" : 0,
            "name" : "台積電",
            "number" : "2330",
            "price" : "589",
            "sale_cost" : 0,
            "sale_date" : 0,
            "sale_price" : 0,
            "sale_sheet" : 0,
            "sheet" : "0.1",
            "status" : "unsale",
            "timestamp" : 1617590846
          },
        }
 ```
### Pages
- 0. 登入頁面
    - 登入
    - 註冊
    - 忘記密碼 
- 1. 記錄頁面
    - 可輸入買入股票(日期、股票名稱、編號、單價、張數)
    - 選擇單一股票賣出
    - 顯示目前投入總成本
    - 簡易資訊顯示(張數、平均單價、手續費、成本)
- 2. 台股歷史紀錄
    - 可查詢時間區段
    - 可以查詢以下類別
      - 未賣出
      - 已買出
      - 全部
- 3. 美股證卷記錄
- 4. 我的帳戶
    - 可輸入存入與提出金額與它的來源
    - 帳戶金額(交割戶)
    - 股票帳戶(証卷戶)
    - 顯示交易記錄
    - 
#### 部屬至GitHub gh-pages

