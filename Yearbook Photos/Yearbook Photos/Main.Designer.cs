namespace Yearbook_Photos {
    partial class Main {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing) {
            if (disposing && (components != null)) {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent() {
            this.lvCurrent = new System.Windows.Forms.ListView();
            this.lvCurrent_Last = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.lvCurrent_First = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.lvCurrent_Grade = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.lvCurrent_ID = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.lvExport = new System.Windows.Forms.ListView();
            this.lvExport_Last = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.lvExport_First = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.lvExport_Grade = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.lvExport_ID = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.btnExport = new System.Windows.Forms.Button();
            this.btnAdd = new System.Windows.Forms.Button();
            this.btnRemove = new System.Windows.Forms.Button();
            this.lblStub = new System.Windows.Forms.Label();
            this.comboYear = new System.Windows.Forms.ComboBox();
            this.pnlImage = new System.Windows.Forms.PictureBox();
            this.lblSearch = new System.Windows.Forms.Label();
            this.txtSearch = new System.Windows.Forms.TextBox();
            this.lblSearchMessage = new System.Windows.Forms.Label();
            ((System.ComponentModel.ISupportInitialize)(this.pnlImage)).BeginInit();
            this.SuspendLayout();
            // 
            // lvCurrent
            // 
            this.lvCurrent.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.lvCurrent_Last,
            this.lvCurrent_First,
            this.lvCurrent_Grade,
            this.lvCurrent_ID});
            this.lvCurrent.FullRowSelect = true;
            this.lvCurrent.Location = new System.Drawing.Point(12, 112);
            this.lvCurrent.Name = "lvCurrent";
            this.lvCurrent.Size = new System.Drawing.Size(250, 400);
            this.lvCurrent.TabIndex = 0;
            this.lvCurrent.UseCompatibleStateImageBehavior = false;
            this.lvCurrent.View = System.Windows.Forms.View.Details;
            this.lvCurrent.ColumnClick += new System.Windows.Forms.ColumnClickEventHandler(this.lvCurrent_ColumnClick);
            this.lvCurrent.SelectedIndexChanged += new System.EventHandler(this.lvCurrent_SelectedIndexChanged);
            // 
            // lvCurrent_Last
            // 
            this.lvCurrent_Last.Text = "Last";
            this.lvCurrent_Last.Width = 100;
            // 
            // lvCurrent_First
            // 
            this.lvCurrent_First.Text = "First";
            this.lvCurrent_First.Width = 100;
            // 
            // lvCurrent_Grade
            // 
            this.lvCurrent_Grade.Text = "Grade";
            // 
            // lvCurrent_ID
            // 
            this.lvCurrent_ID.Text = "ID";
            // 
            // lvExport
            // 
            this.lvExport.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.lvExport_Last,
            this.lvExport_First,
            this.lvExport_Grade,
            this.lvExport_ID});
            this.lvExport.FullRowSelect = true;
            this.lvExport.Location = new System.Drawing.Point(522, 112);
            this.lvExport.Name = "lvExport";
            this.lvExport.Size = new System.Drawing.Size(250, 400);
            this.lvExport.TabIndex = 1;
            this.lvExport.UseCompatibleStateImageBehavior = false;
            this.lvExport.View = System.Windows.Forms.View.Details;
            // 
            // lvExport_Last
            // 
            this.lvExport_Last.Text = "Last";
            this.lvExport_Last.Width = 100;
            // 
            // lvExport_First
            // 
            this.lvExport_First.Text = "First";
            this.lvExport_First.Width = 100;
            // 
            // lvExport_Grade
            // 
            this.lvExport_Grade.Text = "Grade";
            // 
            // lvExport_ID
            // 
            this.lvExport_ID.Text = "ID";
            // 
            // btnExport
            // 
            this.btnExport.Location = new System.Drawing.Point(697, 83);
            this.btnExport.Name = "btnExport";
            this.btnExport.Size = new System.Drawing.Size(75, 23);
            this.btnExport.TabIndex = 2;
            this.btnExport.Text = "Export";
            this.btnExport.UseVisualStyleBackColor = true;
            this.btnExport.Click += new System.EventHandler(this.btnExport_Click);
            // 
            // btnAdd
            // 
            this.btnAdd.Location = new System.Drawing.Point(268, 112);
            this.btnAdd.Name = "btnAdd";
            this.btnAdd.Size = new System.Drawing.Size(75, 23);
            this.btnAdd.TabIndex = 3;
            this.btnAdd.Text = "Add >>";
            this.btnAdd.UseVisualStyleBackColor = true;
            this.btnAdd.Click += new System.EventHandler(this.btnAdd_Click);
            // 
            // btnRemove
            // 
            this.btnRemove.Location = new System.Drawing.Point(441, 112);
            this.btnRemove.Name = "btnRemove";
            this.btnRemove.Size = new System.Drawing.Size(75, 23);
            this.btnRemove.TabIndex = 4;
            this.btnRemove.Text = "<< Remove";
            this.btnRemove.UseVisualStyleBackColor = true;
            this.btnRemove.Click += new System.EventHandler(this.btnRemove_Click);
            // 
            // lblStub
            // 
            this.lblStub.AutoSize = true;
            this.lblStub.Location = new System.Drawing.Point(10, 540);
            this.lblStub.Name = "lblStub";
            this.lblStub.Size = new System.Drawing.Size(31, 13);
            this.lblStub.TabIndex = 6;
            this.lblStub.Text = "v 1.0";
            // 
            // comboYear
            // 
            this.comboYear.FormattingEnabled = true;
            this.comboYear.Location = new System.Drawing.Point(12, 12);
            this.comboYear.Name = "comboYear";
            this.comboYear.Size = new System.Drawing.Size(121, 21);
            this.comboYear.TabIndex = 7;
            // 
            // pnlImage
            // 
            this.pnlImage.Location = new System.Drawing.Point(274, 176);
            this.pnlImage.Name = "pnlImage";
            this.pnlImage.Size = new System.Drawing.Size(235, 311);
            this.pnlImage.SizeMode = System.Windows.Forms.PictureBoxSizeMode.StretchImage;
            this.pnlImage.TabIndex = 8;
            this.pnlImage.TabStop = false;
            // 
            // lblSearch
            // 
            this.lblSearch.AutoSize = true;
            this.lblSearch.Location = new System.Drawing.Point(10, 69);
            this.lblSearch.Name = "lblSearch";
            this.lblSearch.Size = new System.Drawing.Size(44, 13);
            this.lblSearch.TabIndex = 9;
            this.lblSearch.Text = "Search:";
            // 
            // txtSearch
            // 
            this.txtSearch.Location = new System.Drawing.Point(12, 85);
            this.txtSearch.Name = "txtSearch";
            this.txtSearch.Size = new System.Drawing.Size(250, 20);
            this.txtSearch.TabIndex = 10;
            this.txtSearch.Click += new System.EventHandler(this.txtSearch_Click);
            this.txtSearch.KeyPress += new System.Windows.Forms.KeyPressEventHandler(this.txtSearch_KeyPress);
            // 
            // lblSearchMessage
            // 
            this.lblSearchMessage.AutoSize = true;
            this.lblSearchMessage.ForeColor = System.Drawing.Color.Red;
            this.lblSearchMessage.Location = new System.Drawing.Point(61, 69);
            this.lblSearchMessage.Name = "lblSearchMessage";
            this.lblSearchMessage.Size = new System.Drawing.Size(0, 13);
            this.lblSearchMessage.TabIndex = 11;
            // 
            // Main
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(784, 562);
            this.Controls.Add(this.lblSearchMessage);
            this.Controls.Add(this.txtSearch);
            this.Controls.Add(this.lblSearch);
            this.Controls.Add(this.pnlImage);
            this.Controls.Add(this.comboYear);
            this.Controls.Add(this.lblStub);
            this.Controls.Add(this.btnRemove);
            this.Controls.Add(this.btnAdd);
            this.Controls.Add(this.btnExport);
            this.Controls.Add(this.lvExport);
            this.Controls.Add(this.lvCurrent);
            this.Name = "Main";
            this.Text = "Yearbook Photos";
            this.Load += new System.EventHandler(this.Main_Load);
            ((System.ComponentModel.ISupportInitialize)(this.pnlImage)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.ListView lvCurrent;
        private System.Windows.Forms.ColumnHeader lvCurrent_Last;
        private System.Windows.Forms.ColumnHeader lvCurrent_First;
        private System.Windows.Forms.ColumnHeader lvCurrent_Grade;
        private System.Windows.Forms.ListView lvExport;
        private System.Windows.Forms.ColumnHeader lvExport_Last;
        private System.Windows.Forms.ColumnHeader lvExport_First;
        private System.Windows.Forms.ColumnHeader lvExport_Grade;
        private System.Windows.Forms.Button btnExport;
        private System.Windows.Forms.Button btnAdd;
        private System.Windows.Forms.Button btnRemove;
        private System.Windows.Forms.Label lblStub;
        private System.Windows.Forms.ComboBox comboYear;
        private System.Windows.Forms.ColumnHeader lvCurrent_ID;
        private System.Windows.Forms.ColumnHeader lvExport_ID;
        private System.Windows.Forms.PictureBox pnlImage;
        private System.Windows.Forms.Label lblSearch;
        private System.Windows.Forms.TextBox txtSearch;
        private System.Windows.Forms.Label lblSearchMessage;
    }
}

