<template>
  <div class="__ade-form">
		<div :class="formClass" v-for="(col,index) in formatColumns" :key="index">
			<div v-if="!hideLabel" :style="{...epLabelStyle,...labelStyle}" :class="{'__ade-form-label':true,'__ade-form-label-required':col.editor.props.required}">
				<template v-if="col.slots && col.slots.title" && $slots[col.slots.title]>
					<slot :name="col.slots.title"></slot>
				</template>
				<template v-else>
					<span :title="col.title || col.dataIndex">{{col.title || col.dataIndex}}</span>
				</template>
			</div>
			<div :class="{'__ade-form-editor':true,'__ade-form-editor-only':hideLabel && hideErrorMessage}">
				<a-form-item
					:validate-status="col.editor.validate.status"
					:required="col.editor.props.required"
					:help="hideErrorMessage ? '' : col.editor.validate.message"
				>
					<editor-item
						v-bind="eprops"
						:ref="'editorPanel_item_'+index"
						:name="col.title"
						:formLayout="eformLayout"
						:editor="col.editor"
					>
					</editor-item>
				</a-form-item>
			</div>
		</div>
	</div>
</template>
<script>
import EditorItem from './EditorItem.vue'
export default {
  name:'editor-panel',
  props: {
		labelStyle: {type:Object, default(){return {}}},
		formLayout: {type:String,default:()=>{return 'vertical'}}, //vertical,horizontal
		hideErrorMessage: {type:Boolean, default: false},
		hideLabel: {type:Boolean, default: false},
		columns:Array
	},
  components: {EditorItem},
  data() {
    return {
			epLabelStyle: {}
		}
  },
	watch:{
		'columns':{
			handler(val){
				if(this.formLayout != 'horizontal'){
					this.epLabelStyle = {}
					return
				}
				this.epLabelStyle = {
					width: 'auto'
				}
				this.$nextTick(()=>{
					let labelDoms = document.getElementsByClassName('__ade-form-label')
					let maxWidth = 0
					for(let i=0;i<labelDoms.length;i++){
						let width = labelDoms[i].getBoundingClientRect().width
						console.log(width)
						width > maxWidth && (maxWidth = width)
					}
					this.epLabelStyle = {
						width:`${maxWidth}px`
					}
				})
			},
			immediate: true
		}
	},
  computed: {
		formClass(){
			return `__ade-form-${this.eformLayout}`
		},
		eformLayout(){
			let formLayoutTypes = ['horizontal','vertical']
			if(formLayoutTypes.includes(this.formLayout)){
				return this.formLayout
			}else{
				return 'vertical'
			}
		},
		eprops(){
			let props = {}
			for(let key in this.$props){
				let excludeKeys = ['columns']
				if(!excludeKeys.includes(key)){
					props[key] = this.$props[key]
				}
			}
			return props
		},
		slots() {
		  return Object.keys(this.$slots)
		},
    formatColumns(){
			let columns = this.columns.filter(col => !col.editor.hidden)
			let max = 1
			columns.forEach(col=>{
				//初始化数据
				this.$set(col.editor,'type',(col.editor['type'] || 'input').toLowerCase())
        !col.editor['props'] && this.$set(col.editor,'props',{})
        !col.editor['props']['size'] && this.$set(col.editor['props'],'size','small')
        !col.editor['rules'] && this.$set(col.editor,'rules',{})
        !col.editor['validate'] && this.$set(col.editor,'validate',{})
        if(col.editor['props']['required'] && !col.editor['rules']['required']){
          let props = col.editor['props']
          let inputType = ['input','number']
					let title = col.title || col.dataIndex
          col.editor['rules']['required'] = {
            validator:function(value,editor){
              let tval = value
              if(value === 0 && editor.type === 'number'){
                tval = true
              }
              return Boolean(tval)
            },
            message: props.placeholder || (title ? ((inputType.includes(col.editor['type'])?'请输入':'请选择')+ title) : '')
          }
        }
				//排序优先级
				if(col.editor.priority && col.editor.priority>max){
					max = col.editor.priority
				}
			})
			max++
			columns.sort((a,b)=>{
				let aPriority = a.editor.priority || max
				let bPriority = b.editor.priority || max
				return (aPriority >= bPriority) ? 1 : -1
			})
			return columns
		}
  },
  methods: {
    resetValidate() {
      this.formatColumns.forEach(item=>{
        this.$set(item.editor.validate,'status',null)
        this.$set(item.editor.validate,'message','')
      })
    },
    checkValues(cb) {
      let values = {}
      let haveError = false
      this.formatColumns.forEach((item,index)=>{
				this.$refs['editorPanel_item_'+index][0].checkValue()
        values[item.dataIndex] = item.editor.value
        item.editor.validate.status === 'error' && (haveError = true)
      })
			cb(haveError,values)
    }
  }
}
</script>
<style lang="less">
	.__ade-form{
		width: 100%;
		.ant-form-explain{
			font-size: 12px;
			padding-top: 1px;
		}
		.ant-form-item-control,.ant-form-item-label{
			line-height: unset;
		}
		&-horizontal{
			display: flex;
			.__ade-form-label{
				max-width: 50%;
				text-align: right;
			}
		}
		&-vertical{
			.__ade-form-label{
				margin-bottom: 6px;
			}
		}
		&-label{
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			&-required::before{
				display: inline-block;
				margin-right: 4px;
				color: #f5222d;
				font-size: 14px;
				font-family: SimSun, sans-serif;
				content: '*';
			}
			&::after{
				content: ':';
				position: relative;
				top: -0.5px;
				margin: 0 8px 0 2px;
			}
		}
		&-editor{
			flex: 1;
			&-only{
				.ant-form-item{
					margin: 0;
				}
			}
		}
	}
</style>