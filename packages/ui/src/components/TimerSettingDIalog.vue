<script setup>
import { ref, reactive } from 'vue'
const visible = ref(false)
const form = reactive({
  date2: '',
  resource: '',
})
</script>

<template>
  <el-button text @click="visible = true">
    click to open the Dialog
  </el-button>

  <el-dialog
    v-model="visible"
    title="时间设置"
  >
    <el-form :model="form" style="height: 300px;">
      <el-form-item label="Resources">
        <el-radio-group v-model="form.resource">
          <el-radio label="Sponsor" />
          <el-radio label="Venue" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Activity time">
        <el-time-picker
          v-model="form.date2"
          placeholder="Pick a time"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">Cancel</el-button>
        <el-button type="primary" @click="visible = false">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
