<template>
  <div class="table">
    <a-button @click="newRecord">新增</a-button>
    <advance-table
      ref="adTable"
			rowKey="String"
			formLayout="horizontal"
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="pagination"
      :eto="eto"
			@change="onChange"
      @etSuccess="etSuccess"
      @etCancel="etCancel"
      @etIng="etIng"
    >
      <template slot="statusTitle">
        状态
      </template>
      <template slot="options" slot-scope="value">
				<template v-if="eto.style==='modal' || (eto.style != 'modal' && eto.index != value.index)">
					<a-button @click="editRecord(value)">编辑</a-button>
					<a-button @click="deleteRecord(value)">删除</a-button>
				</template>
				<template v-else>
					<a-button @click="saveRecord()" :loading="saveLoading">保存</a-button>
					<a-button @click="cancel()">取消</a-button>
				</template>
      </template>
    </advance-table>
  </div>
</template>

<script>
  import AdvanceTable from '@/components/table/advance/AdvanceTable'
  import {mapActions} from 'vuex'
	
  export default {
    name: 'Table',
    components: {AdvanceTable},
    data() {
      return {
        eto:{
					style:'inline',//modal,inline两种模式
        },
        loading: false,
				saveLoading: false,
        pagination:{
          name:'table',
          current: 1,
          pageSize: 10,
          total: 0
        },
        columns: [
          {
            title: '账号',
            dataIndex: 'Name',
						width: 400,
            editor : {
              type: "textarea",
							priority: 9999,
              props: {
                placeholder:'请输入账号',
                required:true
              }
            },
            search: {
              open: true
            }
          },{
            title: '订单号',
            dataIndex: 'String',
            hidden: true
          },{
            dataIndex: 'Natural',
            width:300,
            editor:{
              type:"select",
              props:{
                required:true
              },
              options:{
                valueField:"value",
                textField:"title",
                data:[{
                  value:1,
                  title:'已下单'
                },{
                  value:2,
                  title:'已付款'
                },{
                  value:3,
                  title:'已审核'
                },{
                  value:4,
                  title:'已发货'
                }]
              }
            },
            formatter:function(value,row,index,column){
              let data = column.editor.options.data
              let fdata = data.find(item=>{
                return item.value == value
              })
              return fdata ? fdata.title : ''
            },
            slots: {title: 'statusTitle'},
            search: {
              open: true
            }
          },{
            title: '发货',
            width: 100,
            dataIndex: 'Boolean',
            editor:{
              type:"switch",
							priority: 2,
              options:{
                valueField:"value",
                textField:"title",
                data:[{
                  value:true,
                  title:'开'
                },{
                  value:false,
                  title:'关'
                }]
              }
            },
            formatter:function(value,row,index,column){
              let data = column.editor.options.data
              let fdata = data.find(item=>{
                return item.value == value
              })
              return fdata ? fdata.title : ''
            },
            search: {
              open: true
            }
          },{
            title: '审核时间',
            dataIndex: 'Date',
            width: 300,
            editor:{
              type:"date",
              props:{
                required:true
              }
            },
            search: {
              open: true
            }
          },{
            title: 'Character',
            dataIndex: 'Character',
            hidden: true,
            editor : {
              type: "number",
              priority: 1,
              props: {
                placeholder:'请输入Character',
                maxLength:10,
                required:true
              }
            }
          },{
            title: '操作',
            dataIndex: 'options',
            scopedSlots: {customRender: 'options'},
            editor:{
              type:"none",
							hidden: true
            }
          }
        ],
        dataSource: [],
        conditions: {}
      }
    },
    mounted() {
      this.loadList()
    },
    methods: {
      ...mapActions('example', ['tableList']),
      newRecord(){
				this.eto.title = '新增'
        this.$refs.adTable.add()
      },
      editRecord(value){
				this.eto.title = '编辑'
        this.$refs.adTable.edit(value.index)
      },
      deleteRecord(value){
        console.log(value)
      },
			saveRecord(){
				this.$refs.adTable.save()
			},
			cancel(){
				this.$refs.adTable.cancel()
			},
      etCancel(){},
      etSuccess(values,cb){
				setTimeout(()=>{
					console.log(values,23423)
					cb()
				},2000)
      },
      etIng(loading){
        this.saveLoading = loading
      },
      loadList() {
        this.loading = true
        this.tableList({
          page:this.pagination.current,
          rows:this.pagination.pageSize
        }).then(({data})=>{
          this.loading = false
          this.pagination.total = data.total
          this.dataSource = data.rows
          console.log(data)
        })
      },
      onChange(pagination,filters,sorter,source){
        this.loadList()
      }
    }
  }
</script>

<style scoped lang="less">
.table{
  background-color: @base-bg-color;
  padding: 24px;
}
</style>