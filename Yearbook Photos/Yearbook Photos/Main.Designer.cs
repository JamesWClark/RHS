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
            this.lvExport = new System.Windows.Forms.ListView();
            this.lvCurrent_Last = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.lvCurrent_First = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.lvCurrent_Grade = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.btnExport = new System.Windows.Forms.Button();
            this.btnAdd = new System.Windows.Forms.Button();
            this.btnRemove = new System.Windows.Forms.Button();
            this.pnlImage = new System.Windows.Forms.Panel();
            this.lvExport_Last = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.lvExport_First = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.lvExport_Grade = ((System.Windows.Forms.ColumnHeader)(new System.Windows.Forms.ColumnHeader()));
            this.lblStub = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // lvCurrent
            // 
            this.lvCurrent.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.lvCurrent_Last,
            this.lvCurrent_First,
            this.lvCurrent_Grade});
            this.lvCurrent.Location = new System.Drawing.Point(13, 49);
            this.lvCurrent.Name = "lvCurrent";
            this.lvCurrent.Size = new System.Drawing.Size(175, 364);
            this.lvCurrent.TabIndex = 0;
            this.lvCurrent.UseCompatibleStateImageBehavior = false;
            this.lvCurrent.View = System.Windows.Forms.View.Details;
            this.lvCurrent.SelectedIndexChanged += new System.EventHandler(this.lvCurrent_SelectedIndexChanged);
            // 
            // lvExport
            // 
            this.lvExport.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.lvExport_Last,
            this.lvExport_First,
            this.lvExport_Grade});
            this.lvExport.Location = new System.Drawing.Point(597, 12);
            this.lvExport.Name = "lvExport";
            this.lvExport.Size = new System.Drawing.Size(175, 400);
            this.lvExport.TabIndex = 1;
            this.lvExport.UseCompatibleStateImageBehavior = false;
            this.lvExport.View = System.Windows.Forms.View.Details;
            // 
            // lvCurrent_Last
            // 
            this.lvCurrent_Last.Text = "Last";
            // 
            // lvCurrent_First
            // 
            this.lvCurrent_First.Text = "First";
            // 
            // lvCurrent_Grade
            // 
            this.lvCurrent_Grade.Text = "Grade";
            // 
            // btnExport
            // 
            this.btnExport.Location = new System.Drawing.Point(597, 419);
            this.btnExport.Name = "btnExport";
            this.btnExport.Size = new System.Drawing.Size(75, 23);
            this.btnExport.TabIndex = 2;
            this.btnExport.Text = "Export";
            this.btnExport.UseVisualStyleBackColor = true;
            // 
            // btnAdd
            // 
            this.btnAdd.Location = new System.Drawing.Point(195, 13);
            this.btnAdd.Name = "btnAdd";
            this.btnAdd.Size = new System.Drawing.Size(75, 23);
            this.btnAdd.TabIndex = 3;
            this.btnAdd.Text = "Add";
            this.btnAdd.UseVisualStyleBackColor = true;
            // 
            // btnRemove
            // 
            this.btnRemove.Location = new System.Drawing.Point(516, 13);
            this.btnRemove.Name = "btnRemove";
            this.btnRemove.Size = new System.Drawing.Size(75, 23);
            this.btnRemove.TabIndex = 4;
            this.btnRemove.Text = "Remove";
            this.btnRemove.UseVisualStyleBackColor = true;
            // 
            // pnlImage
            // 
            this.pnlImage.Location = new System.Drawing.Point(309, 112);
            this.pnlImage.Name = "pnlImage";
            this.pnlImage.Size = new System.Drawing.Size(172, 228);
            this.pnlImage.TabIndex = 5;
            // 
            // lvExport_Last
            // 
            this.lvExport_Last.Text = "Last";
            // 
            // lvExport_First
            // 
            this.lvExport_First.Text = "First";
            // 
            // lvExport_Grade
            // 
            this.lvExport_Grade.Text = "Grade";
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
            // Main
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(784, 562);
            this.Controls.Add(this.lblStub);
            this.Controls.Add(this.pnlImage);
            this.Controls.Add(this.btnRemove);
            this.Controls.Add(this.btnAdd);
            this.Controls.Add(this.btnExport);
            this.Controls.Add(this.lvExport);
            this.Controls.Add(this.lvCurrent);
            this.Name = "Main";
            this.Text = "Yearbook Photos";
            this.Load += new System.EventHandler(this.Main_Load);
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
        private System.Windows.Forms.Panel pnlImage;
        private System.Windows.Forms.Label lblStub;
    }
}

