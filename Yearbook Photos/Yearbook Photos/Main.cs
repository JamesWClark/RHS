using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace Yearbook_Photos {
    public partial class Main : Form {

        private const string ROOT_PATH = @"C:\LocalStorage\static";
        private ListViewColumnSorter sorter;

        public Main() {
            InitializeComponent();
            sorter = new ListViewColumnSorter();
            lvCurrent.ListViewItemSorter = sorter;
        }

        private void Main_Load(object sender, EventArgs e) {

            //network connection may not be available, try
            try {

                //connect to a main directory
                string rootPath = ROOT_PATH;

                //the main directory has directories for every year
                string[] yearFolders = Directory.GetDirectories(rootPath);

                //make a drop down list for sub directories of the main directory
                SetDropDownOptions(rootPath, yearFolders);

                //every year has additional directories if new data is added
                foreach (string s in yearFolders) {
                    string[] subFolders = Directory.GetDirectories(s);
                    foreach (string subFolder in subFolders) {
                        //for every directory in the top year do
                        //every directory has an IDLINK.TXT file
                        string[] linkFiles = Directory.GetFiles(subFolder, "IDLINK.TXT");
                        //create the master record for list view
                        //process the IDLINK.TXT as a CSV file
                        foreach (string csv in linkFiles) {
                            StreamReader reader = new StreamReader(csv);
                            while (!reader.EndOfStream) {
                                //CSV columns: StudentID, PictureFile, FirstName, Grade, LastName, StudentID, Homeroom#
                                //example: "1234","1234.jpg","CLARK","10","JAMES","1234","107"
                                string line = reader.ReadLine();
                                string[] values = line.Split(',');
                                //populate list view based on master record: list view: lastname, firstname, grade, id
                                ListViewItem item = new ListViewItem(values[4].Replace("\"", string.Empty)); //last name
                                item.SubItems.Add(values[2].Replace("\"", string.Empty)); //first name
                                item.SubItems.Add(values[3].Replace("\"", string.Empty)); //grade
                                item.SubItems.Add(values[0].Replace("\"", string.Empty)); //id
                                item.ImageKey = subFolder;
                                lvCurrent.Items.Add(item);
                            }
                        }
                    }
                }
                lvCurrent.Sort();

                //show initial picture
                lvCurrent.Items[0].Selected = true;

                //catch exception
            } catch (Exception ex) {
                lblStub.Text = ex.Message;
            }
        }
        private void SetDropDownOptions(string rootPath, string[] yearFolders) {
            foreach (string s in yearFolders) {
                comboYear.Items.Add(s.Replace(rootPath + @"\", String.Empty));
            }

            //sort top of list by most recently modified directory
            if (comboYear.Items.Count > 0) {
                DateTime newest = new DateTime();
                int count = 0;
                foreach (string folder in yearFolders) {
                    DateTime creationTime = Directory.GetCreationTime(folder);
                    if (creationTime > newest) {
                        newest = creationTime;
                        comboYear.SelectedIndex = count;
                        count++;
                    }
                }
            }
        }

        private void lvCurrent_ColumnClick(object sender, ColumnClickEventArgs e) {
            if (e.Column == sorter.SortColumn) {
                if (sorter.Order == SortOrder.Ascending) {
                    sorter.Order = SortOrder.Descending;
                } else {
                    sorter.Order = SortOrder.Ascending;
                }
            } else {
                sorter.SortColumn = e.Column;
                sorter.Order = SortOrder.Ascending;
            }
            lvCurrent.Sort();
        }
        private void lvCurrent_SelectedIndexChanged(object sender, EventArgs e) {
            try {
                string path = lvCurrent.SelectedItems[0].ImageKey + @"\"
                    + lvCurrent.SelectedItems[0].SubItems[3].Text + ".jpg";
                Image image = Image.FromFile(path);
                pnlImage.Image = image;
            } catch {

            }
        }

        private void btnAdd_Click(object sender, EventArgs e) {
            ListView.SelectedListViewItemCollection items = lvCurrent.SelectedItems;
            

            foreach (ListViewItem item in lvCurrent.SelectedItems) {
                lvCurrent.Items.Remove(item);
                lvExport.Items.Add(item);
            }
        }

        private void btnRemove_Click(object sender, EventArgs e) {
            foreach (ListViewItem item in lvExport.SelectedItems) {
                lvExport.Items.Remove(item);
                lvCurrent.Items.Add(item);
            }
            lvCurrent.Sort();
        }

        private void btnExport_Click(object sender, EventArgs e) {
            FolderBrowserDialog fbd = new FolderBrowserDialog();
            DialogResult result = fbd.ShowDialog();

            ProgressBar progress = new ProgressBar();
            
            foreach (ListViewItem item in lvExport.Items) {
                string source = item.ImageKey + @"\" + item.SubItems[3].Text + ".jpg";
                string destination = fbd.SelectedPath + @"\" + item.SubItems[3].Text + ".jpg";
                lblStub.Text = "source: " + source + " , destination: " + destination;
                File.Copy(source, destination);
            }
        }

        private void txtSearch_KeyPress(object sender, KeyPressEventArgs e) {
            if (e.KeyChar == (char)13) {
                e.Handled = true;
                lvCurrent.Focus();
                foreach (ListViewItem item in lvCurrent.SelectedItems) {
                    item.Selected = false;
                }
                try {
                    lvCurrent.FindItemWithText(txtSearch.Text).Selected = true;
                } catch (NullReferenceException) {
                    lblSearchMessage.Text = "A match was not found.";
                }
            }
        }

        private void txtSearch_Click(object sender, EventArgs e) {
            lblSearchMessage.Text = string.Empty;
            txtSearch.SelectionStart = 0;
            txtSearch.SelectionLength = txtSearch.Text.Length;
        }
    }
}
