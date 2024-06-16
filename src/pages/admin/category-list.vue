<template>
  <el-card shadow="never" :body-style="{ padding: '20px' }" class="mb-5 border-1">
    <!-- card body -->
    <el-text class="mx-1 mr-3">类型</el-text>
    <el-select v-model="spTypeCode" class="w-50 mr-5" clearable  placeholder="请选择">
      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
    </el-select>
<!--    <el-input v-model="searchCategoryName" placeholder="请输入（模糊查询）" class="w-50 mr-5"/>-->

<!--
    <el-text class="mx-1 mr-3">创建日期</el-text>
    <el-date-picker style="top: 3px" v-model="pickDate" type="daterange" range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间" :shortcuts="shortcuts" size="default" @change="datepickerChange"/>
-->

    <el-button type="primary" class="ml-3" :icon="Search" @click="getTableData">查询</el-button>
    <el-button class="ml-3" :icon="RefreshRight" @click="reset">重置</el-button>
  </el-card>

  <el-card shadow="never" class="border-1">
    <!-- card body -->
    <!-- 新增按钮 -->
    <div>
      <el-button type="primary" @click="isAddCatagoryDialogShow = true">
        <el-icon class="mr-1">
          <Plus/>
        </el-icon>
        新增
      </el-button>
    </div>

    <el-table :data="tableData" stripe style="width: 100%" class="mt-4" v-loading="tableLoading">
      <!-- <el-table-column prop="id" label="ID" width="180" /> -->
      <el-table-column
          type="index"
          label="#"
          width="50">
      </el-table-column>
      <el-table-column
          label="分类种类"
          width="180"
      >
        <template v-slot:default="scope">
          <div v-show="scope.row.propTypeCode=='tag'">
            标签
          </div>
          <div v-show="scope.row.propTypeCode=='category'">
            分类
          </div>
        </template>

      </el-table-column>


      <el-table-column prop="propValue" label="描述" width="180"/>
<!--      <el-table-column prop="articleCnt" label="文章个数" width="90">

      </el-table-column>-->
      <el-table-column prop="createTime" label="创建时间" width="180">

      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="danger" size="small" @click="deleteCategorySubmit(scope.row)">
            <el-icon class="mr-1">
              <Delete/>
            </el-icon>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="mt-5 flex item-center justify-center">
      <!--      <div class="block">
              <span class="demonstration">大于 7 页时的效果</span>
              <el-pagination
                  layout="prev, pager, next"
                  :total="1000">
              </el-pagination>
            </div>-->
    </div>
  </el-card>

  <!-- 新增分类 -->
  <el-dialog v-model="isAddCatagoryDialogShow" title="新增分类/标签" width="30%" :show-close="false" draggable>
    <el-form :model="form" ref="formRef" label-position="top" :size="large" :rules="rules">
      <el-form-item label="名称" prop="propValue">
        <el-input v-model="form.propValue" autocomplete="off" size="large" maxlength="10" show-word-limit clearable/>
      </el-form-item>
      <el-form-item label="类型(分类/标签)">
          <el-select v-model="pTypeCode" clearable  placeholder="请选择">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
            <span class="dialog-footer">
                <el-button @click="isAddCatagoryDialogShow = false">取消</el-button>
                <el-button type="primary" @click="addCategoryTagSubmit(form.propValue)">
                    提交
                </el-button>
            </span>
    </template>
  </el-dialog>
</template>

<script setup>
// import { ElMessage, ElMessageBox } from 'element-plus'
import {ref, reactive} from 'vue'
import {addCategory, getCategoryPageList, deleteCategory} from '@/api/admin/category'
import {showMessage} from '@/composables/util'
import moment from 'moment';
import {Search, RefreshRight} from '@element-plus/icons-vue'

const isAddCatagoryDialogShow = ref(false)

const searchCategoryName = ref('')
const pickDate = ref('')
const startDate = reactive({})
const endDate = reactive({})
const options=[{
  value: 'CATEGORY',
  label: '分类'
}, {
  value: 'TAG',
  label: '标签'
}]
var pTypeCode=ref({})
var spTypeCode=ref({})

const reset = () => {
  pickDate.value = ''
  startDate.value = null
  endDate.value = null
  searchCategoryName.value = ''
}

const datepickerChange = (e) => {
  startDate.value = moment(e[0]).format('YYYY-MM-DD HH:mm:ss')
  endDate.value = moment(e[1]).format('YYYY-MM-DD HH:mm:ss')
}

const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]

const form = reactive({
  propValue: '',
  propCode: '',
  propTypeCode: ''
})

const formRef = ref(null)
const rules = {
  name: [
    {required: true, message: '请输入分类名称', trigger: 'blur'},
    {min: 1, max: 10, message: '分类名称字数要求大于1个字符，小于20个字符', trigger: 'blur'},
  ]
}

function addCategoryTagSubmit( propValue) {
  options.forEach((item)=>{
    console.log("pTypeCode.value:"+JSON.stringify(pTypeCode.value) +"  item.value:"+item.value)
    if (pTypeCode.value === item.value) {
      console.log("jinlaile:"+item.value)
      var data = {
        'requestMetaInfo': {
          'traceId': 'String'
        },
        'props': [{
          'propTypeCode': item.value,
          'propValue': propValue,
        }]
      }
       addCategory(data).then((e) => {
         if (!(e.code == '1')) {
           var message = e.message
           showMessage(message, 'warning', 'message')
           return
         }

         showMessage('添加成功', 'success', 'message')
         isAddCatagoryDialogShow.value = false
         getTableData()
       })
    }
  })

}

const tableLoading = ref(false)
const tableData = ref([])
// 当前页码
const current = ref(1)
const total = ref(0)
const size = ref(10)

// 获取分页数据
function getTableData() {
  tableLoading.value = true
  var data = {
    "requestMetaInfo": {
      "traceId": "String"
    },
    "propTypeCode":(Object.keys(spTypeCode.value).length === 0)?null:spTypeCode.value,
    "pageNum": 1,
    "pageSize": size.value == null ? 20 : size.value
  }
  getCategoryPageList(data)
      .then((res) => {
        if (res.code == 1) {
          tableData.value = res.data.datas
          current.value = res.data.pageNum
          total.value = res.data.total
          size.value = res.data.pageSize
        }
      }).finally(() => {
    tableLoading.value = false
  })
}

getTableData()

const handleSizeChange = (e) => {
  console.log('选择的页码' + e)
  size.value = e
  getTableData()
}

const deleteCategorySubmit = (row) => {
  console.log("row:"+JSON.stringify(row))
  let data={
    "requestMetaInfo": {
      "traceId": "String"
    },
    "props": [row]
  }
  ElMessageBox.confirm(
      '是否确认要删除该分类?',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(() => {
        console.log("已删除")
        deleteCategory(data).then((e) => {
          console.log("已删除")
          if (e.code == '1') {
            showMessage('删除成功', 'success')
            getTableData()
          } else {
            let message = e.message
            showMessage(message, 'warning')
          }
        })

      })
}


</script>

<style>
</style>