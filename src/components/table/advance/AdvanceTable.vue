<template>
  <div ref="table" :id="id" class="advanced-table">
    <a-spin :spinning="loading">
      <!-- 
        <div class="actions">
          <a-icon v-if="showFullScreenBtn" @click="toggleScreen" class="action" :type="fullScreen ? 'fullscreen-exit' : 'fullscreen'" />
        </div> 
			-->
      <a-table
        v-bind="{...$props, columns: fColumns, title: undefined, loading: false, pagination:cpPagination}"
        :size="sSize"
        @expandedRowsChange="onExpandedRowsChange"
        @change="onChange"
        @expand="onExpand"
      >
        <template slot-scope="text, record, index" :slot="slot" v-for="(slot,i) in scopedSlots ">
          <slot :name="slot" v-bind="{text, record, index}">
            <template v-if="eto.style==='inline' && eto.index === index">
              <a-popover v-if="getColumn(slot).editor.validate && getColumn(slot).editor.validate.status === 'error'" title="" trigger="hover">
                <template slot="content">
                  {{getColumn(slot).editor.validate && getColumn(slot).editor.validate.message}}
                </template>
                <editor-panel :ref="'editorItem_'+i" :columns="[getColumn(slot)]" formLayout="horizontal" :hideLabel="true" :hideErrorMessage="true" />
              </a-popover>
              <editor-panel v-else :ref="'editorItem_'+i" :columns="[getColumn(slot)]" formLayout="horizontal" :hideLabel="true" :hideErrorMessage="true" />
            </template>
            <template v-else>
							<div :title="formatText(text, record, index, slot)">{{formatText(text, record, index, slot)}}</div>
						</template>
          </slot>
        </template>
        <template :slot="slot" v-for="slot in slots">
          <slot :name="slot"></slot>
        </template>
        <template slot-scope="record, index, indent, expanded" :slot="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''">
          <slot v-bind="{record, index, indent, expanded}" :name="$scopedSlots.expandedRowRender ? 'expandedRowRender' : ''"></slot>
        </template>
      </a-table>
      <optTableModal
        v-if="eto.style!='inline'"
        ref="optTableModal"
        :columns="eColumns"
        :title="eTitle"
        :maskClosable="false"
        :formLayout="formLayout"
        @ok="saveSucEvent"
        @unok="saveErrorEvent"
        @cancel="cancel"
      >
        <template :slot="slot" v-for="slot in slots">
          <slot :name="slot"></slot>
        </template>
      </optTableModal>
    </a-spin>
  </div>
</template>

<script>
  import EditorPanel from './EditorPanel.vue'
  import optTableModal from './optTableModal.vue'
	import { Table } from 'ant-design-vue'
  export default {
    name: 'AdvanceTable',
    components: {EditorPanel,optTableModal},
    props: {
			...Table.props,
      showFullScreenBtn: {type:Boolean, default: false},
      formLayout: {type:String,default:()=>{return 'vertical'}},
      eto: { type: Object, default:()=> {return {}}}
    },
    data() {
      return {
        id: `${new Date().getTime()}-${Math.floor(Math.random() * 10)}`,
        sSize: this.size || 'default',
        fullScreen: false,
        optTableModal:{
          title:''
        },
        cpPagination:{
          current: 1,
          pageSize: 10,
          total: 0,
          showSizeChanger: true,
          showLessItems: true,
          showQuickJumper: false,
          pageSizeOptions: ['10', '20', '30', '40', '50']
        }
      }
    },
    watch:{
      pagination:{
        handler(val){
          for(let key in val){
            this.cpPagination[key] = val[key]
          }
        },
        deep:true
      }
    },
    computed: {
      slots() {
        return Object.keys(this.$slots)
      },
      scopedSlots() {
        let scopedSlotsArr = Object.keys(this.$scopedSlots)
        this.columns.forEach(item=>{
          let itemScopedSlots = item['scopedSlots'] || {}
          let customRender = itemScopedSlots['customRender']
          if(!customRender || (customRender && !scopedSlotsArr.includes(customRender))){
            scopedSlotsArr.push(item['dataIndex'])
          }
        })
        return scopedSlotsArr.filter(slot => slot !== 'expandedRowRender')
      },
      fColumns(){
        let columns = this.columns.filter(col => !col.hidden)
        this.formatColumns(columns)
        return columns
      },
			eTitle(){
				return this.eto.title || 'Title'
			},
      eColumns(){
        this.formatColumns(this.columns)
				let columns = this.columns.filter(col => {
					let columnHide = col.hidden
					let editorHide = col.editor.hidden
					if(this.eto.style === 'inline'){
						return !columnHide && !editorHide
					}else{
						return !editorHide
					}
				})
        return columns
      }
    },
    created() {
      this.initEto()
      this.initPagingAttr()
			this.addListener()
    },
    beforeDestroy() {
      this.removeListener()
    },
    methods: {
			initEto(){
				!this.eto.hasOwnProperty('style') && this.$set(this.eto,'style','modal')
				!this.eto.hasOwnProperty('index') && this.$set(this.eto,'index',-1)
				!this.eto.hasOwnProperty('title') && this.$set(this.eto,'title','')
			},
      formatColumns(columns){
        columns.forEach(item=>{
          !item['scopedSlots'] && this.$set(item,'scopedSlots',{})
          !item['editor'] && this.$set(item,'editor',{})
					if(item['editor']['type'] === 'textarea' && this.eto.style === 'inline'){
						item['editor']['type'] = 'input'
					}
          if(item['customRender']){
            item['customRender'] && (item['formatter'] = item['customRender'])
            delete item['customRender']
          }else if(!item['formatter']){
            item['formatter'] = value=>value
          }
          let customRender = item['scopedSlots']['customRender']
          if(!customRender || (customRender && !Object.keys(this.$scopedSlots).includes(customRender))){
            item['scopedSlots']['customRender'] = item['dataIndex']
          }
        })
      },
      saveErrorEvent(values){
        this.$emit('etError',values)
      },
			setSaveStatus(status){
				this.$emit('etIng',status)
				this.eColumns.forEach(item=>{
				  this.$set(item.editor.props,'disabled',status)
				})
			},
			beforeSave(){
				this.setSaveStatus(true)
			},
			afterSave(){
				this.setSaveStatus(false)
			},
      saveSucEvent(values,cb){
        this.beforeSave()
        this.$emit('etSuccess',values,(error)=>{
          this.afterSave()
					if(!error){
						//更新列表
						if(this.eto.style === 'inline' || this.eto.type === 'edit'){
							let editData = this.dataSource[this.eto.index]
							for(let key in values){
								if(editData.hasOwnProperty(key)){
									editData[key] = values[key]
								}
							}
						}else{
							this.dataSource.unshift(values)
						}
					}
					cb(error)
        })
      },
      resetValidate(editor){
        if(editor.validate){
          this.$set(editor.validate,'status',null)
          this.$set(editor.validate,'message','')
        }
      },
      add(){
				let addObj = {}
				this.eto.type = 'add'
        this.eColumns.forEach(item=>{
					addObj[item['dataIndex']] = ''
          this.$set(item.editor,'value','')
          this.$set(item.editor,'_value','')
          this.resetValidate(item.editor)
        })
        if(this.eto.style != 'inline'){
					this.eto.index = -1
					this.$refs.optTableModal.changeModal()
				}else{
					this.eto.index = 0
					this.dataSource.unshift(addObj)
				}
      },
      edit(index){
				this.eto.type = 'edit'
				this.eto.index = index
        let record = this.dataSource[index]
        this.eColumns.forEach(item=>{
          this.$set(item.editor,'value',record[item.dataIndex])
          this.resetValidate(item.editor)
        })
        if(this.eto.style != 'inline'){
          this.$refs.optTableModal.changeModal()
        }
      },
			save(){
        let values = {}
        let haveError = false
        for(let i=0;i<this.scopedSlots.length;i++){
          if(this.$refs['editorItem_'+i]){
            let currentEditorItem = this.$refs['editorItem_'+i][0]
            currentEditorItem.checkValues((error,value)=>{
              if(error){
                haveError = error
              }
              Object.assign(values,value)
            })
          }
        }
        if(haveError){
          this.saveErrorEvent(values)
        }else{
          this.saveSucEvent(values,(error)=>{
            if(!error){
              this.resetEto()
            }
          })
        }
			},
			cancel(){
        if(this.eto.style === 'inline' && this.eto.type === 'add'){
          this.dataSource.shift()
        }
				this.resetEto()
				this.$emit('etCancel')
			},
      resetEto(){
        this.eto.type = null
				this.eto.index = -1
      },
      initPagingAttr(){
        let paging = JSON.parse(window.localStorage.getItem('paging') || '{}')
        let name = this.pagination.name
        if(name && paging[name] && paging[name]['pageSize']){
          this.pagination['pageSize'] = paging[name]['pageSize']
        }
        let funcString = ['onShowSizeChange','onChange']
        funcString.forEach(item=>{
          let oneFunc = this.pagination[item]
          this.cpPagination[item] = (page,size) =>{
            if(item == 'onShowSizeChange'){
              this.pagination.current = 1
            }else{
              this.pagination.current = page
            }
            this.pagination.pageSize = size
            this.setPagingAttr()
            oneFunc && oneFunc(this.pagination.current,this.pagination.pageSize)
          }
        })
      },
      setPagingAttr(){
        let name = this.pagination.name
        if(name){
          let paging = JSON.parse(window.localStorage.getItem('paging') || '{}')
          !paging[name] && (paging[name] = {})
          paging[name]['pageSize'] = this.pagination['pageSize']
          window.localStorage.setItem('paging',JSON.stringify(paging))
        }
      },
      getColumn(key){
        let column = this.fColumns.find(item=>{
          return item.dataIndex == key
        })
        return column
      },
      formatText(text, record, index ,key){
        let column = this.fColumns.find(item=>{
          return item.scopedSlots.customRender == key
        })
        return column.formatter(text, record, index, column)
      },
      toggleScreen() {
        if (this.fullScreen) {
          this.outFullScreen()
        } else {
          this.inFullScreen()
        }
      },
      inFullScreen() {
        const el = this.$refs.table
        el.classList.add('beauty-scroll')
        if (el.requestFullscreen) {
          el.requestFullscreen()
          return true
        } else if (el.webkitRequestFullScreen) {
          el.webkitRequestFullScreen()
          return true
        } else if (el.mozRequestFullScreen) {
          el.mozRequestFullScreen()
          return true
        } else if (el.msRequestFullscreen) {
          el.msRequestFullscreen()
          return true
        }
        this.$message.warn('对不起，您的浏览器不支持全屏模式')
        el.classList.remove('beauty-scroll')
        return false
      },
      outFullScreen() {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
        this.$refs.table.classList.remove('beauty-scroll')
      },
      onExpandedRowsChange(expandedRows) {
        this.$emit('expandedRowsChange', expandedRows)
      },
      onChange(pagination, filters, sorter, options) {
        pagination.current = this.pagination.current
        this.$emit('change', pagination, filters, sorter, options)
      },
      onExpand(expanded, record) {
        this.$emit('expand', expanded, record)
      },
      addListener() {
        document.addEventListener('fullscreenchange', this.fullScreenListener)
        document.addEventListener('webkitfullscreenchange', this.fullScreenListener)
        document.addEventListener('mozfullscreenchange', this.fullScreenListener)
        document.addEventListener('msfullscreenchange', this.fullScreenListener)
      },
      removeListener() {
        document.removeEventListener('fullscreenchange', this.fullScreenListener)
        document.removeEventListener('webkitfullscreenchange', this.fullScreenListener)
        document.removeEventListener('mozfullscreenchange', this.fullScreenListener)
        document.removeEventListener('msfullscreenchange', this.fullScreenListener)
      },
      fullScreenListener(e) {
        if (e.target.id === this.id) {
          this.fullScreen = !this.fullScreen
        }
      }
    }
  }
</script>