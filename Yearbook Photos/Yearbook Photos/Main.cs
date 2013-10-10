//performance on list views is rough
//try to fix with http://stackoverflow.com/questions/6089674/whats-better-to-use-a-datagrid-or-listview-for-displaying-large-amounts-of-dat

using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using System.Windows.Forms;

namespace Yearbook_Photos {
    public partial class Main : Form {

        private string rootPath;
        private string[] yearFolders;
        private ListViewColumnSorter sorter;

        public Main() {
            InitializeComponent();
            sorter = new ListViewColumnSorter();
            lvCurrent.ListViewItemSorter = sorter;
            rootPath = @"G:\YearbookPhotos";
            yearFolders = Directory.GetDirectories(rootPath); //the main directory has directories for every year

            //make a drop down list for sub directories of the main directory
            SetDropDownOptions(rootPath, yearFolders);

            //XDocument xdoc = XDocument.Load("settings");
            //rootPath = xdoc.Descendants("rootPath").First().Value;
        }

        private void Main_Load(object sender, EventArgs e) {
            SetLists();
        }

        private void SetLists() {
            //network connection may not be available, try
            try {     

                string selectedYear = rootPath + @"\" + comboYear.SelectedItem;

                //every year has additional directories if new data is added

                string[] subFolders = Directory.GetDirectories(selectedYear);
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
                            item.SubItems.Add(values[3].Replace("\"", string.Empty).TrimStart(new char[] { '0' })); //grade
                            item.SubItems.Add(values[0].Replace("\"", string.Empty)); //id
                            item.ImageKey = subFolder;
                            lvCurrent.Items.Add(item);
                        }
                    }
                }

                //show initial picture
                if (lvCurrent.Items.Count > 0) {
                    lvCurrent.Sort();
                    lvCurrent.Items[0].Selected = true;
                }

                //catch exception

            } catch (Exception ex) {
                lblStub.Text = ex.Message;
            }
        }

        private void SetDropDownOptions(string rootPath, string[] yearFolders) {
            ArrayList items = new ArrayList();
            foreach (string s in yearFolders) {
                items.Add(s);
                
            }
            items.Reverse();
            foreach (string s in items) {
                comboYear.Items.Add(s.Replace(rootPath + @"\", String.Empty));
            }
            comboYear.SelectedIndex = 0;
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

        }

        private void btnAdd_Click(object sender, EventArgs e) {
            ListView.SelectedListViewItemCollection items = lvCurrent.SelectedItems;
            

            foreach (ListViewItem item in lvCurrent.SelectedItems) {
                lvCurrent.Items.Remove(item);
                lvExport.Items.Add(item);
            }

            if (lvExport.Items.Count > 0) {
                btnExport.Enabled = true;
            }
        }

        private void btnRemove_Click(object sender, EventArgs e) {
            foreach (ListViewItem item in lvExport.SelectedItems) {
                lvExport.Items.Remove(item);
                lvCurrent.Items.Add(item);
            }

            if (lvExport.Items.Count == 0) {
                btnExport.Enabled = false;
            }

            lvCurrent.Sort();
        }

        private void btnExport_Click(object sender, EventArgs e) {
            FolderBrowserDialog fbd = new FolderBrowserDialog();
            DialogResult result = fbd.ShowDialog();

            string path = fbd.SelectedPath;
            if (path != null) {
                if (Directory.GetFiles(path).Length == 0) {
                    foreach (ListViewItem item in lvExport.Items) {
                        try {
                            string source = item.ImageKey + @"\" + item.SubItems[3].Text + ".jpg";
                            string destination = fbd.SelectedPath + @"\" + item.SubItems[3].Text + ".jpg";
                            File.Copy(source, destination);
                        } catch (Exception) {
                            //skip that one, probably an IOException due to file exists already
                            //HOWEVER, 2013-14 missed 1 file
                        }
                    }
                } else {
                    string error = "Files exist in the folder you selected.\nPlease create or select an empty folder and try again.";
                    string caption = "Export Error";
                    MessageBox.Show(error, caption, MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
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

        private void comboYear_SelectedIndexChanged(object sender, EventArgs e) {
            lvCurrent.Items.Clear();
            lvExport.Items.Clear();
            SetLists();
        }

        private void lvCurrent_ItemSelectionChanged(object sender, ListViewItemSelectionChangedEventArgs e) {
            if (e.IsSelected) {
                try {
                    string path = e.Item.ImageKey + @"\"
                        + e.Item.SubItems[3].Text + ".jpg";
                    Image image = Image.FromFile(path);
                    pnlImage.Image = image;
                } catch {

                }
            }
        }

        private void lvExport_ItemSelectionChanged(object sender, ListViewItemSelectionChangedEventArgs e) {
            if (e.IsSelected) {
                try {
                    string path = e.Item.ImageKey + @"\"
                        + e.Item.SubItems[3].Text + ".jpg";
                    Image image = Image.FromFile(path);
                    pnlImage.Image = image;
                } catch {

                }
            }
        }

        private void btnSelectAll_lvCurrent_Click(object sender, EventArgs e) {
            lvCurrent.Focus();
            foreach (ListViewItem item in lvCurrent.Items) {
                item.Selected = true;
            }
        }

        private void btnSelectAll_lvExport_Click(object sender, EventArgs e) {
            lvExport.Focus();
            foreach (ListViewItem item in lvExport.Items) {
                item.Selected = true;
            }
        }

        private void lvCurrent_KeyDown(object sender, KeyEventArgs e) {
            if (e.KeyCode == Keys.A && e.Control) {
                foreach (ListViewItem item in lvCurrent.Items) {
                    item.Selected = true;
                }
            }
        }

        private void lvExport_KeyDown(object sender, KeyEventArgs e) {
            if (e.KeyCode == Keys.A && e.Control) {
                foreach (ListViewItem item in lvExport.Items) {
                    item.Selected = true;
                }
            }
        }
    }
}
