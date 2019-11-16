<template>
  <div class="about">
    <h1>{{id ? '編輯' : '新建'}}分類</h1>
    <el-form label-width="120px" @submit.native.prevent="save">
      <!-- <el-form-item label="上級分類">
           <el-select v-model="model.parent">
               <el-option v-for="item in parents" :key="item._id"
                :label="item.name" :value="item._id"></el-option>
           </el-select>
      </el-form-item>-->
      <el-form-item label="名稱">
        <el-input v-model="model.name"></el-input>
      </el-form-item>
      <el-form-item label="頭像">
        <el-upload
          class="avatar-uploader"
          :action="$http.defaults.baseURL + '/upload'"
          :show-file-list="false"
          :on-success="afterUpload"
        >
          <img v-if="model.avatar" :src="model.avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="稱號">
        <el-input v-model="model.title"></el-input>
      </el-form-item>
      <el-form-item label="類型">
        <el-select v-model="model.categories" multiple>
          <el-option
            v-for="item of categories"
            :key="item._id"
            :label="item.name"
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="難度">
        <el-rate style="margin-top:0.6rem" show-score :max="9" v-model="model.scores.difficult"></el-rate>
      </el-form-item>
      <el-form-item label="技能">
        <el-rate style="margin-top:0.6rem" show-score :max="9" v-model="model.scores.skills"></el-rate>
      </el-form-item>
      <el-form-item label="攻擊">
        <el-rate style="margin-top:0.6rem" show-score :max="9" v-model="model.scores.attack"></el-rate>
      </el-form-item>
      <el-form-item label="生存">
        <el-rate style="margin-top:0.6rem" show-score :max="9" v-model="model.scores.survive"></el-rate>
      </el-form-item>
      <el-form-item label="順風出裝">
        <el-select v-model="model.items1" multiple>
          <el-option v-for="item of items" :key="item._id" :label="item.name" :value="item._id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="逆風出裝">
        <el-select v-model="model.items2" multiple>
          <el-option v-for="item of items" :key="item._id" :label="item.name" :value="item._id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="使用技巧">
        <el-input type="textarea" v-model="model.usageTips"></el-input>
      </el-form-item>
      <el-form-item label="對抗技巧">
        <el-input type="textarea" v-model="model.battleTips"></el-input>
      </el-form-item>
      <el-form-item label="團戰技巧">
        <el-input type="textarea" v-model="model.teamTips"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
export default {
  props: {
    id: {}
  },
  data() {
    return {
      items: [],
      categories: [],
      model: {
        scores: {
          difficult: 0
        }
      }
    };
  },
  methods: {
    afterUpload(res) {
      this.$set(this.model, "avatar", res.url);
      // this.model.icon = res.url;
    },
    async save() {
      if (this.id) {
        await this.$http.put(`rest/heros/${this.id}`, this.model);
      } else {
        await this.$http.post("rest/heros", this.model);
      }
      this.$router.push("/heros/list");
      this.$message({
        type: "success",
        message: "保存成功"
      });
    },
    async fetch() {
      const res = await this.$http.get(`rest/heros/${this.id}`);
      this.model = Object.assign({}, this.model, res.data);
    },
    async fetchCategories() {
      const res = await this.$http.get(`rest/categories`);
      this.categories = res.data;
    },
    async fetchItems() {
      const res = await this.$http.get(`rest/items`);
      this.items = res.data;
    }
  },
  created() {
    this.id && this.fetch();
    this.fetchCategories();
    this.fetchItems();
  }
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>