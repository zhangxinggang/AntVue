<template>
  <div>
    <a-modal
      v-model="visible"
			on-ok="handleOk"
			v-bind="{...$props,closable}"
    >
      <template slot="footer">
        <a-button @click="handleCancel"> 关闭 </a-button>
        <a-button
          type="primary"
          :loading="loading"
          @click="handleOk"
        >
          确定
        </a-button>
      </template>
			<editor-panel :formLayout="formLayout" :columns="columns" ref="editorPanel">
				<template :slot="slot" v-for="slot in slots">
				  <slot :name="slot"></slot>
				</template>
			</editor-panel>
    </a-modal>
  </div>
</template>
<script>
import { Modal } from 'ant-design-vue'
import EditorPanel from './EditorPanel.vue'
export default {
  name:'opt-table-modal',
  props: {
		...Modal.props,
		formLayout: {type:String,default:()=>{return 'vertical'}},
		columns:Array
	},
  components: {EditorPanel},
  data() {
    return {
      visible: false,
      loading: false,
      closable: false
    };
  },
  computed: {
		slots() {
		  return Object.keys(this.$slots)
		}
  },
  methods: {
    changeModal() {
      this.visible = !this.visible
			this.$nextTick(()=>{
				this.$refs.editorPanel.resetValidate()
			})
    },
    handleOk() {
      this.closable = false
			this.$refs.editorPanel.checkValues((error,values)=>{
        if(error){
          this.closable = true
				  this.$emit('unok',values)
        }else{
          this.loading = true
          this.$emit('ok',values,(error)=>{
            this.loading = false
            this.closable = true
            if(!error){
              this.visible = false
            }
          })
        }
      })
    },
    handleCancel(e) {
      this.$emit('cancel')
      this.visible = false;
    }
  }
}
</script>